// Browser checks against the production build (served by `vite preview`).
// Usage: npm run build && (npx vite preview --port 4173 &) && SITE=<slug> npm run test:e2e -- [screenshotDir]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright"); // pre-installed Playwright, or a local one
const URL = process.env.URL ?? "http://localhost:4173/";
const shots = process.argv[2];
const NOTICE = "Demo concept, not an official website; we will remove it upon the first request.";
import { readFileSync } from "node:fs";
const SITE = process.env.SITE ?? "hybrid-center";
const content = JSON.parse(readFileSync(new globalThis.URL(`../content/${SITE}.json`, import.meta.url), "utf8"));
const TEL = `tel:${content.contacts.phones[0].e164}`;
const MAPQ = content.contacts.address.mapQuery;
const DESIGN = content.design ?? "atelier";
const DISPLAY = { volt: "Exo 2 Variable", ion: "Geologica Variable" }[content.skin] ?? "Unbounded Variable";
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });
const browser = await chromium.launch();

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(60); }
  await page.waitForTimeout(900);
}

const vps = [
  { n: "phone-320", w: 320, h: 640 }, { n: "phone-390", w: 390, h: 844 }, { n: "tablet-768", w: 768, h: 1024 },
  { n: "laptop-1280", w: 1280, h: 800 }, { n: "desktop-1440", w: 1440, h: 900 }, { n: "wide-1920", w: 1920, h: 1080 },
];
for (const vp of vps) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const external = [], errors = [];
  page.on("request", (r) => { if (!r.url().startsWith(URL)) external.push(r.url()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(URL, { waitUntil: "networkidle" });
  const t = (s) => `${vp.n}: ${s}`;
  check(t("no third-party requests"), external.length === 0, external.slice(0, 3).join(", "));
  if (DESIGN === "atelier") check(t(`fonts loaded locally (${DISPLAY} + Onest)`), await page.evaluate(async (f) => { await document.fonts.ready; return document.fonts.check(`300 40px "${f}"`, "Ая") && document.fonts.check('400 16px "Onest Variable"', "Ая"); }, DISPLAY));
  else check(t("font loaded locally (Onest)"), await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('400 16px "Onest Variable"', "Ая"); }));
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(t("no horizontal scroll"), ov <= 0, `overflow=${ov}`);
  if (DESIGN === "atelier") {
    const words = content.hero.title.replace(/\.$/, "").split(" ").length;
    const h1 = await page.evaluate(() => { const h = document.querySelector("h1"); const lines = [...h.querySelectorAll(".h1-line")]; return { fits: lines.every((l) => l.scrollWidth <= h.clientWidth + 1), tops: new Set(lines.map((l) => Math.round(l.getBoundingClientRect().top))).size }; });
    check(t(`H1: ${words} lines, no word overflows`), h1.fits && h1.tops === words, JSON.stringify(h1));
  } else {
    const h1 = await page.evaluate(() => { const h = document.querySelector("h1"); return { text: h.textContent, fits: h.scrollWidth <= h.clientWidth + 1 }; });
    check(t("H1 = business name, no overflow"), h1.fits && h1.text === content.business.name, JSON.stringify(h1));
    const open = await page.getByTestId("open-now").textContent().catch(() => null);
    check(t("open-now line shown, labelled as directory data"), !content.contacts.hours.value || (open && /Открыто до|Закрыто до/.test(open) && open.includes("справочник")), String(open));
  }
  const bar = page.getByTestId("demo-bar");
  check(t("demo notice exact + visible"), (await bar.textContent()) === NOTICE && (await bar.isVisible()));
  const heroCta = await page.locator(".hero [data-testid=book]").boundingBox();
  check(t("hero booking CTA in first viewport"), heroCta && heroCta.y + heroCta.height <= vp.h, JSON.stringify(heroCta));
  await scrollThrough(page);
  const barBox = await page.locator(".demo-bar").boundingBox();
  check(t("demo notice sticky after scroll"), barBox && barBox.y >= -1 && barBox.y < 2 && (await bar.isVisible()), JSON.stringify(barBox) + " scrollY=" + await page.evaluate(() => scrollY));
  check(t("footer notice exact"), (await page.getByTestId("footer-notice").textContent()) === NOTICE);
  check(t("no forms/inputs/iframes"), (await page.locator("form,input,textarea,select,iframe").count()) === 0);
  check(t("no cookies / storage"), (await ctx.cookies()).length === 0 && (await page.evaluate(() => localStorage.length + sessionStorage.length)) === 0);
  const tels = await page.locator('a[href^="tel:"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
  const allowed = content.contacts.phones.map((p) => `tel:${p.e164}`);
  check(t("all tel: links point to listed numbers"), tels.length >= 1 && tels.includes(TEL) && tels.every((x) => allowed.includes(x)), tels.join(","));
  const map = await page.getByTestId("map-link").evaluate((a) => [decodeURIComponent(a.href), a.target, a.rel]);
  check(t("route link → Yandex Maps, new tab, noopener"), map[0].includes(MAPQ) && map[1] === "_blank" && map[2].includes("noopener"));
  check(t("all reveal elements became visible"), (await page.locator(".reveal:not(.is-in)").count()) === 0);
  const brokenImg = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  check(t("no broken images"), brokenImg.length === 0, brokenImg.join(","));
  const anchors = await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")).filter((h) => h.length > 1 && !document.getElementById(h.slice(1))));
  check(t("every in-page link has a target"), anchors.length === 0, anchors.join(","));
  if (vp.w < 640) {
    const small = await page.locator("a.btn, button, .icon-btn").evaluateAll((els) => els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 44); }).map((e) => e.textContent.trim().slice(0, 20)));
    check(t("tap targets ≥ 44px"), small.length === 0, small.join(" | "));
  }
  if (shots) {
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1300);
    await page.screenshot({ path: `${shots}/${vp.n}-top.png` });
    await page.screenshot({ path: `${shots}/${vp.n}-full.png`, fullPage: true });
  }
  check(t("no console/page errors"), errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// Mobile interactions
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  const toggle = page.getByTestId("menu-toggle");
  if (await toggle.count()) {
  await toggle.click();
  const menu = page.getByTestId("mobile-menu");
  check("menu: opens, aria-expanded=true", (await menu.isVisible()) && (await toggle.getAttribute("aria-expanded")) === "true");
  check("menu: focus moved into menu", await page.evaluate(() => !!document.activeElement.closest("#mobile-menu")));
  for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");
  check("menu: focus trapped", await page.evaluate(() => !!document.activeElement.closest("#mobile-menu")));
  if (shots) await page.screenshot({ path: `${shots}/phone-390-menu.png` });
  await page.keyboard.press("Escape");
  check("menu: Esc closes and returns focus", !(await menu.isVisible()) && (await page.evaluate(() => document.activeElement.dataset.testid)) === "menu-toggle");
  await toggle.click();
  await menu.getByRole("link", { name: /Цены/ }).click();
  await page.waitForTimeout(900);
  const pricesTop = await page.locator("#prices").boundingBox();
  check("menu: link navigates and closes menu", !(await menu.isVisible()) && pricesTop.y < 300, JSON.stringify(pricesTop.y));
  } else {
    // «card» design: sticky section tabs instead of a hamburger menu.
    const tab = page.locator(".tabs a", { hasText: "Цены" });
    await tab.click(); await page.waitForTimeout(1000);
    const r = await page.evaluate(() => { const c = document.querySelector(".chrome").getBoundingClientRect(); const p = document.getElementById("prices").getBoundingClientRect(); return { chromeBottom: c.bottom, pricesTop: p.top }; });
    check("tabs: «Цены» scrolls to prices just below the sticky chrome", r.pricesTop >= r.chromeBottom - 1 && r.pricesTop < r.chromeBottom + 60, JSON.stringify(r));
    check("tabs: active tab marked aria-current", (await tab.getAttribute("aria-current")) === "true");
    check("tabs: chrome stays sticky", r.chromeBottom > 0 && (await page.getByTestId("demo-bar").isVisible()));
    if (shots) await page.screenshot({ path: `${shots}/phone-390-tabs.png` });
  }
  check("call bar: shown away from hero/contacts", await page.getByTestId("call-bar").evaluate((e) => e.classList.contains("is-shown")));
  await page.locator("#contacts").scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
  check("call bar: hidden over contacts", await page.getByTestId("call-bar").evaluate((e) => !e.classList.contains("is-shown")));
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500);
  check("call bar: hidden over hero", await page.getByTestId("call-bar").evaluate((e) => !e.classList.contains("is-shown")));
  await ctx.close();
}

// Desktop interactions: service «Подробнее» opens matching price row; keyboard
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  const firstHref = await page.locator(".svc-1 .svc-link").getAttribute("href");
  await page.locator(".svc-1 .svc-link").click();
  await page.waitForTimeout(900);
  const row = page.locator(firstHref);
  check("service «Подробнее» → opens its price row", (await row.locator("button").getAttribute("aria-expanded")) === "true");
  check("opened row scrolled into view", await row.evaluate((r) => { const b = r.getBoundingClientRect(); return b.top >= 0 && b.top < innerHeight; }));
  if (SITE === "an-designstudio") {
    await page.locator("#price-polish-q button").click();
    check("unverified row shows «уточняйте» copy", (await page.locator("#pd-polish-q").textContent()).includes("Уточняйте у студии"));
  }
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  check("keyboard: first Tab = skip link", await page.evaluate(() => document.activeElement.classList.contains("skip")));
  await page.keyboard.press("Enter");
  check("keyboard: skip link → main", await page.evaluate(() => document.activeElement.id === "main"));
  await page.keyboard.press("Tab");
  check("keyboard: focus ring visible", await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== "none"));
  const priceBtn = page.locator(".price-row button").first(); await priceBtn.focus(); await page.keyboard.press("Enter");
  check("keyboard: Enter toggles price row", (await priceBtn.getAttribute("aria-expanded")) === "true");
  await ctx.close();
}

// Reduced motion
{
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  if (DESIGN === "atelier") {
    const r = await page.evaluate(() => ({ motion: document.documentElement.classList.contains("motion"), anim: getComputedStyle(document.querySelector(".h1-word")).animationName, op: getComputedStyle([...document.querySelectorAll(".reveal")].at(-1)).opacity }));
    check("reduced motion: no animations, content visible without scrolling", !r.motion && r.anim === "none" && r.op === "1", JSON.stringify(r));
  } else {
    const r = await page.evaluate(() => ({ motion: document.documentElement.classList.contains("motion"), tr: getComputedStyle(document.querySelector(".tab")).transitionDuration, sb: getComputedStyle(document.documentElement).scrollBehavior }));
    check("reduced motion: no transitions, no smooth scroll", !r.motion && r.tr.split(",").every((d) => parseFloat(d) === 0) && r.sb === "auto", JSON.stringify(r));
  }
  await ctx.close();
}

await browser.close();
let fail = 0;
for (const r of results) { if (!r.ok) fail++; if (!r.ok || process.env.VERBOSE) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  [" + r.detail + "]" : ""}`); }
console.log(`\n${results.length - fail}/${results.length} passed`);
process.exit(fail ? 1 : 0);
