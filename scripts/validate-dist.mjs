// Checks every built site against the data rules: owner-provided facts only,
// phone links only to the owner's numbers, external links only to the address
// map search and a verified business website, no prices, no foreign images.
// Usage: node scripts/validate-dist.mjs [site ...]
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mapSearchUrl, parsePhones } from '../shared/lib/model.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const only = process.argv.slice(2);
const sites = readdirSync(`${root}/sites`)
  .filter((name) => /^service_\d\d$/.test(name))
  .sort();
const targets = only.length > 0 ? only : sites;
const problems = [];
const decode = (text) =>
  text
    .replace(/&nbsp;|&#160;| /g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"');
const norm = (text) => decode(text).replace(/\s+/g, ' ');
const stripTags = (html) =>
  norm(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' '));

for (const id of targets) {
  const fail = (message) => problems.push(`${id}: ${message}`);
  const dist = `${root}/sites/${id}/dist`;
  const profile = JSON.parse(readFileSync(`${root}/services/${id}/profile.json`, 'utf8'));
  for (const file of ['index.html', 'privacy/index.html', 'robots.txt', 'sitemap.xml', 'favicon.svg']) {
    if (!existsSync(`${dist}/${file}`)) fail(`missing ${file}`);
  }
  if (!existsSync(`${dist}/index.html`)) continue;
  const html = readFileSync(`${dist}/index.html`, 'utf8');
  const privacy = existsSync(`${dist}/privacy/index.html`)
    ? readFileSync(`${dist}/privacy/index.html`, 'utf8')
    : '';
  const text = stripTags(html);
  const phones = parsePhones(profile.phone);
  const website = profile.website_url ?? profile.public_research.public_website_url;
  const allowedLinks = new Set([mapSearchUrl('Артём', profile.address), ...(website ? [website] : [])]);
  const allowedTel = new Set(phones.map((phone) => `tel:${phone.href}`));

  for (const [name, page] of [
    ['index', html],
    ['privacy', privacy],
  ]) {
    if (!/<html[^>]*lang="ru"/.test(page)) fail(`${name}: <html lang="ru"> missing`);
    if ((page.match(/<h1[\s>]/g) ?? []).length !== 1) fail(`${name}: expected exactly one <h1>`);
    if (!/<title>[^<]{10,}<\/title>/.test(page)) fail(`${name}: <title> missing`);
    if (!/<meta name="description" content="[^"]{40,}"/.test(page)) fail(`${name}: meta description missing`);
    if (!/name="viewport"/.test(page)) fail(`${name}: viewport meta missing`);
    if (!/class="skip-link"/.test(page)) fail(`${name}: skip link missing`);

    for (const [, href] of page.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const url = decode(href);
      if (/^https?:/.test(url) && !allowedLinks.has(url)) fail(`${name}: external link not allowed: ${url}`);
      if (url.startsWith('tel:') && !allowedTel.has(url)) fail(`${name}: tel: link not in profile: ${url}`);
      if (url.startsWith('mailto:')) {
        const email = url.slice(7);
        const official = (profile.public_research.notes ?? []).join(' ');
        if (!website || !official.includes(email))
          fail(`${name}: e-mail not stated on the business website: ${email}`);
      }
    }
    if (/wa\.me|api\.whatsapp|t\.me\/|telegram\.me|max\.ru|viber:|vk\.com/i.test(page))
      fail(`${name}: messenger/social link present but none is supplied`);
    if (/<a\b[^>]*target="_blank"(?![^>]*rel="noopener noreferrer")/.test(page))
      fail(`${name}: target=_blank without rel`);

    for (const [, src] of page.matchAll(/<(?:img|source|video|iframe)\b[^>]*\bsrc(?:set)?="([^"]+)"/g)) {
      if (/^(https?:)?\/\//.test(src)) fail(`${name}: hot-linked media ${src}`);
    }
    if (/unsplash|pexels|pinterest|googleusercontent|fonts\.googleapis/i.test(page))
      fail(`${name}: external media/CDN reference found`);
    if (/<img\b(?![^>]*\balt=)/.test(page)) fail(`${name}: <img> without alt`);
    if (/<img\b/.test(page) && (profile.approved_photos ?? []).length === 0)
      fail(`${name}: <img> rendered although no approved photos exist`);
  }

  // Owner-provided facts appear exactly as supplied.
  if (!text.includes(profile.address)) fail(`address not displayed exactly: ${profile.address}`);
  for (const phone of phones) {
    if (!text.includes(phone.display)) fail(`phone not displayed exactly: ${phone.display}`);
  }
  if (!/без указанного бренда/.test(profile.business_name) && !text.includes(profile.business_name))
    fail(`business name not displayed: ${profile.business_name}`);
  for (const service of profile.services_ru) {
    if (!text.toLowerCase().includes(service.toLowerCase())) fail(`service not displayed: ${service}`);
  }
  // Any other phone-like number is a fabricated or unconfirmed contact.
  const shown = text.replace(/\+7 900 000-00-00/g, '');
  const stripped = phones.reduce((acc, phone) => acc.split(phone.display).join(''), shown);
  if (/(\+7|\b8)[\s(]*\d{3,5}[\s)]*\d{1,3}[\s-]?\d{2}[\s-]?\d{2}/.test(stripped))
    fail('a phone number not supplied by the owner is displayed');

  // No prices: none is confirmed by a business.
  if (/\d[\d ]*\s?(₽|руб)/.test(text)) fail('a rouble amount is displayed although no price is confirmed');
  if (!/Стоимость уточняйте по телефону|Цены — по телефону/.test(text))
    fail('neutral price statement missing');

  // Hours only when the business website states them.
  if (/\b\d{1,2}:\d{2}\b/.test(text) && !/09:00–21:00/.test((profile.public_research.notes ?? []).join(' ')))
    fail('clock time displayed although no schedule is verified');

  const claims =
    /лучш|№\s?1|официальн\w* дилер|гаранти|круглосуточно|24\/7|с \d{4} года|лет опыта|сертифи|более \d+ клиент|отзыв|рейтинг/i;
  const claim = claims.exec(text);
  if (claim)
    fail(`unverified claim in copy: "${text.slice(Math.max(0, claim.index - 30), claim.index + 40)}"`);

  if (!/data-lead-form/.test(html)) fail('lead form missing');
  if (/data-endpoint=""/.test(html) && !/демо-режиме/.test(text)) fail('demo form is not labelled as a demo');
  if (!/name="consent"/.test(html)) fail('consent checkbox missing');
  if (!/Демонстрационный концепт сайта/.test(text)) fail('demo-concept notice missing in footer');
}

if (problems.length > 0) {
  console.error(`validate-dist: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`validate-dist: OK (${targets.length} sites)`);
