// Screenshots of a built site for visual review (desktop + mobile, hero + full page).
// Usage: node scripts/screenshot.mjs <site> <output-dir>
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = fileURLToPath(new URL('..', import.meta.url));
const [site, out] = process.argv.slice(2);
if (!site || !out) {
  console.error('Usage: node scripts/screenshot.mjs <site> <output-dir>');
  process.exit(1);
}
const { server, port } = await serve(`${root}/sites/${site}/dist`);
const browser = await chromium.launch();
for (const [name, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${out}/${site}-${name}-hero.png` });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 500) {
    await page.evaluate((value) => window.scrollTo(0, value), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(900);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${site}-${name}-full.png`, fullPage: true });
  console.log(`${site} ${name}: page height ${total}px`);
  await page.close();
}
await browser.close();
server.close();
