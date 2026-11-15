// Browser smoke tests against the production builds (sites/*/dist).
// Requires Playwright with Chromium: `npm i -D playwright && npx playwright install chromium`
// Usage: node tests/e2e/smoke.mjs [site ...]
import { createRequire } from 'node:module';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from '../../scripts/serve-dist.mjs';

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const root = fileURLToPath(new URL('../..', import.meta.url));
const only = process.argv.slice(2);
const sites = (
  only.length > 0 ? only : readdirSync(`${root}/sites`).filter((name) => /^service_\d\d$/.test(name))
).sort();
const failures = [];
let checks = 0;
const browser = await chromium.launch();

for (const id of sites) {
  const dist = `${root}/sites/${id}/dist`;
  if (!existsSync(`${dist}/index.html`)) {
    failures.push(`${id}: not built`);
    continue;
  }
  const { server, port } = await serve(dist);
  const origin = `http://127.0.0.1:${port}`;
  const expect = (condition, message) => {
    checks += 1;
    if (!condition) failures.push(`${id}: ${message}`);
  };

  for (const [label, width, height] of [
    ['mobile', 375, 780],
    ['tablet', 768, 1024],
    ['desktop', 1440, 900],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('requestfailed', (request) => errors.push(`request failed: ${request.url()}`));
    const external = [];
    page.on(
      'request',
      (request) =>
        !request.url().startsWith(origin) &&
        !request.url().startsWith('data:') &&
        external.push(request.url()),
    );

    const response = await page.goto(`${origin}/`, { waitUntil: 'load' });
    expect(response?.status() === 200, `${label}: home did not load`);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= total; y += 400) {
      await page.evaluate((value) => window.scrollTo(0, value), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(1300);
    expect(errors.length === 0, `${label}: console/page errors: ${errors.join(' | ')}`);
    expect(external.length === 0, `${label}: external requests: ${external.join(', ')}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow <= 0, `${label}: horizontal overflow of ${overflow}px`);
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-reveal]')].filter(
          (node) =>
            // Elements inside a collapsed <details> are not rendered and reveal when it opens.
            node.checkVisibility() &&
            (getComputedStyle(node).opacity === '0' ||
              /^inset\(.*100%/.test(getComputedStyle(node).clipPath)),
        ).length,
    );
    expect(hidden === 0, `${label}: ${hidden} element(s) never revealed after scrolling`);
    const closed = page.locator('details:not([open]) > summary');
    if ((await closed.count()) > 0) {
      await closed.first().click();
      await page.waitForTimeout(1500);
      const stuck = await page.evaluate(
        () =>
          [...document.querySelectorAll('details[open] [data-reveal]')].filter(
            (node) => getComputedStyle(node).opacity === '0',
          ).length,
      );
      expect(stuck === 0, `${label}: ${stuck} row(s) stayed hidden after opening an accordion`);
    }
    const smallTargets = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          'a.btn, button, .site-nav__link, .mobile-menu__link, input:not([type=checkbox]):not([tabindex="-1"]), select',
        ),
      ]
        .filter((node) => node.offsetParent !== null)
        .map((node) => ({
          box: node.getBoundingClientRect(),
          text: (node.textContent || node.name || '').trim().slice(0, 30),
        }))
        .filter(({ box }) => box.height < 43.5)
        .map(({ text, box }) => `${text} (${Math.round(box.height)}px)`),
    );
    expect(smallTargets.length === 0, `${label}: touch targets under 44px: ${smallTargets.join(', ')}`);

    if (label === 'mobile') {
      const toggle = page.locator('[data-menu-toggle]');
      await page.evaluate(() => window.scrollTo(0, 0));
      await toggle.click();
      expect((await toggle.getAttribute('aria-expanded')) === 'true', 'mobile menu did not open');
      await page.keyboard.press('Escape');
      expect(
        (await toggle.getAttribute('aria-expanded')) === 'false',
        'Escape did not close the mobile menu',
      );
    }

    if (label === 'desktop') {
      // Keyboard: first Tab lands on the skip link.
      await page.goto(`${origin}/`, { waitUntil: 'load' });
      await page.keyboard.press('Tab');
      expect(
        await page.evaluate(() => document.activeElement?.classList.contains('skip-link')),
        'skip link is not first in tab order',
      );

      // Form: empty submit shows inline errors and focuses the first invalid field.
      const form = page.locator('[data-lead-form]');
      await form.locator('[type=submit]').click();
      expect(
        (await form.locator('[data-error-for="name"]').isVisible()) &&
          (await form.locator('[data-error-for="consent"]').isVisible()),
        'validation errors not shown',
      );
      expect(
        (await form.locator('[name=name]').getAttribute('aria-invalid')) === 'true',
        'aria-invalid not set',
      );
      expect(
        await page.evaluate(() => document.activeElement?.getAttribute('name') === 'name'),
        'focus not moved to first invalid field',
      );
      await form.locator('[name=name]').fill('Тест');
      await form.locator('[name=contact]').fill('abc');
      await form.locator('[type=submit]').click();
      expect(await form.locator('[data-error-for="contact"]').isVisible(), 'bad contact accepted');
      await form.locator('[name=contact]').fill('+7 900 000-00-00');
      await form.locator('[name=consent]').check();
      await form.locator('[type=submit]').click();
      const status = form.locator('[data-form-status]');
      expect(await status.isVisible(), 'no status after valid submit');
      expect(
        (await status.getAttribute('data-kind')) === 'demo' &&
          /никуда не отправлена/.test(await status.innerText()),
        'demo submit is not labelled as not sent',
      );
      expect(/Тест/.test(await status.innerText()), 'entered data was discarded');

      const privacy = await page.goto(`${origin}/privacy/`);
      expect(privacy?.status() === 200 && (await page.locator('h1').count()) === 1, 'privacy page broken');
      await page.locator('.brand').click();
      await page.waitForURL(`${origin}/`);
      expect(true, 'navigation back');
    }
    await page.close();
  }

  // Reduced motion: everything readable immediately, no parallax transforms.
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1280, height: 800 },
  });
  const calm = await context.newPage();
  await calm.goto(`${origin}/`);
  await calm.waitForTimeout(300);
  const state = await calm.evaluate(() => ({
    hidden: [...document.querySelectorAll('[data-reveal], [data-split]')].filter(
      (node) =>
        getComputedStyle(node).opacity === '0' || /^inset\(.*100%/.test(getComputedStyle(node).clipPath),
    ).length,
    moved: [...document.querySelectorAll('[data-parallax]')].filter((node) =>
      node.style.getPropertyValue('--parallax-y'),
    ).length,
  }));
  expect(state.hidden === 0, `reduced motion: ${state.hidden} element(s) hidden`);
  expect(state.moved === 0, 'reduced motion: parallax still active');
  await context.close();

  // No JavaScript: content must still be visible.
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const plain = await noJs.newPage();
  await plain.goto(`${origin}/`);
  const invisible = await plain.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal], [data-split]')].filter(
        (node) => getComputedStyle(node).opacity === '0',
      ).length,
  );
  expect(invisible === 0, `no-JS: ${invisible} element(s) hidden`);
  await noJs.close();
  server.close();
  console.log(`${id}: done`);
}

await browser.close();
if (failures.length > 0) {
  console.error(`\ne2e: ${failures.length} failure(s) in ${checks} checks\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`\ne2e: OK (${checks} checks across ${sites.length} site(s))`);
