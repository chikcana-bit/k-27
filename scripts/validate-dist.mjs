// Checks every built site against the data-source and photography rules:
// only verified facts, no fabricated contact actions, no foreign images.
// Usage: node scripts/validate-dist.mjs [site ...]
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { formatNumberRu, parsePrice } from '../shared/lib/model.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const only = process.argv.slice(2);
const sites = readdirSync(`${root}/sites`)
  .filter((name) => /^service_\d\d$/.test(name))
  .sort();
const targets = only.length > 0 ? only : sites;
const problems = [];
const norm = (text) => text.replace(/&nbsp;|&#160;| /g, ' ').replace(/\s+/g, ' ');
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

    // Contact actions: no phone links, no guessed messenger links.
    if (/href="tel:/i.test(page)) fail(`${name}: tel: link present but no full phone number is verified`);
    if (/wa\.me|api\.whatsapp|t\.me\/|telegram\.me|max\.ru|viber:|vk\.com/i.test(page)) {
      fail(`${name}: messenger/social link present but no handle is verified`);
    }
    if (/\+7[\s (‒-]*\d{3}[\s )‒-]*\d{3}/.test(stripTags(page).replace(/\+7 900 000-00-00/g, ''))) {
      fail(`${name}: something that looks like a phone number is displayed`);
    }

    // Links: only the business's own 2GIS URLs and its verified e-mail.
    const allowed = new Set([profile['2gis'], profile.price_url, profile.gallery_url]);
    for (const [, href] of page.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      if (/^https?:/.test(href) && !allowed.has(href)) fail(`${name}: external link not in profile: ${href}`);
      if (href.startsWith('mailto:') && href !== `mailto:${profile.email}`)
        fail(`${name}: unverified e-mail ${href}`);
    }
    if (/<a\b[^>]*target="_blank"(?![^>]*rel="noopener noreferrer")/.test(page))
      fail(`${name}: target=_blank without rel`);

    // Photography: local, approved images only; nothing hot-linked.
    for (const [, src] of page.matchAll(/<(?:img|source|video|iframe)\b[^>]*\bsrc(?:set)?="([^"]+)"/g)) {
      if (/^(https?:)?\/\//.test(src)) fail(`${name}: hot-linked media ${src}`);
    }
    if (/photo\.2gis\.com|unsplash|pexels|pinterest|googleusercontent|fonts\.googleapis/i.test(page)) {
      fail(`${name}: external media/CDN reference found`);
    }
    if (/<img\b(?![^>]*\balt=)/.test(page)) fail(`${name}: <img> without alt`);
    if (/<(?:img)\b/.test(page) && (profile.approved_photos ?? []).length === 0) {
      fail(`${name}: <img> rendered although no approved photos exist`);
    }
  }

  // Facts: name and every verified price are shown; no other rouble amounts appear.
  if (!text.includes(profile.name.replace('&', '&amp;')) && !text.includes(profile.name))
    fail('business name not displayed');
  const rows = profile.prices.map((item) => parsePrice(item.price, ''));
  const allowedAmounts = new Set(rows.flatMap((row) => [row.min, row.max]).filter((value) => value !== null));
  for (const row of rows) {
    if (!text.includes(norm(row.display))) fail(`price not displayed: ${row.display}`);
  }
  for (const [, amount] of text.matchAll(/(\d[\d ]*\d|\d) ?(?:₽|руб)/g)) {
    const value = Number(amount.replace(/ /g, ''));
    if (!allowedAmounts.has(value)) fail(`rouble amount not in profile: ${formatNumberRu(value)} ₽`);
  }
  if (profile.prices.length > 0 && !/не являются публичной офертой/.test(text))
    fail('price disclaimer missing');
  if (profile.prices.length === 0 && /₽|руб\./.test(text)) fail('prices shown although none are verified');

  // Hours: a schedule may be shown only when the profile states the full one.
  const fullHours = /^Daily, /.test(profile.hours);
  if (!fullHours && /\b\d{1,2}:\d{2}\b/.test(text))
    fail('clock time displayed although the weekly schedule is not verified');

  // Unverifiable marketing claims.
  const claims =
    /лучш|№\s?1|официальн\w* дилер|гаранти|круглосуточно|24\/7|с \d{4} года|лет опыта|сертифи|более \d+ клиент/i;
  const claim = claims.exec(text);
  if (claim)
    fail(`unverified claim in copy: "${text.slice(Math.max(0, claim.index - 30), claim.index + 40)}"`);

  // Form honesty.
  if (!/data-lead-form/.test(html)) fail('lead form missing');
  if (/data-endpoint=""/.test(html) && !/демо-режиме/.test(text)) fail('demo form is not labelled as a demo');
  if (!/name="consent"/.test(html)) fail('consent checkbox missing');
}

if (problems.length > 0) {
  console.error(`validate-dist: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`validate-dist: OK (${targets.join(', ')})`);
