# QA Report

Date: 15 November 2026 · Command: `npm run qa` (exit code 0)

## Results

| Step | Scope | Result |
| --- | --- | --- |
| `validate:data` | 6 profiles vs `data/services.json`, photo approvals | Pass |
| `lint` | ESLint (TypeScript, scripts, tests) + Prettier | Pass |
| `check` | `astro check` on all six sites (TypeScript strict + templates) | Pass, 0 errors / 0 warnings |
| `test` | 11 unit tests (price / rating / hours parsing, copy-to-data alignment, form validation) | 11 passed, 0 failed |
| `build` | Production build of six sites (2 pages + robots.txt + sitemap.xml each) | Pass |
| `validate:dist` | Fact and media rules on the built HTML of six sites | Pass |
| `test:e2e` | Playwright/Chromium against the builds | 201 checks passed across 6 sites |
| `build:pages` | Combined build under a sub-path (`/demo/<id>/`) | Pass (links, assets, `noindex`, robots verified) |

## What the automated checks cover

**Facts (`validate:dist`)** — every price from the profile is on the page and no other rouble amount
is; no `tel:` links, no messenger/social links, nothing that looks like a phone number; external
links limited to the business's own three 2GIS URLs and its verified e-mail; no clock times unless
the full schedule is on record; a list of unverifiable claims (best, official, guarantee, 24/7,
"since…", certified) is absent; price disclaimer and demo-form label present.

**Media** — no `<img>` at all while no photos are approved; no hot-linked media; no external
requests of any kind at runtime (fonts are self-hosted).

**Browser (`test:e2e`), at 375, 768 and 1440 px** — no console or page errors; no horizontal
overflow; every scroll-reveal element ends visible; accordions reveal their rows; interactive
targets are at least 44 px high; mobile menu opens and closes with Escape; skip link is first in tab
order; form shows inline errors, sets `aria-invalid`, moves focus to the first invalid field,
rejects a malformed contact, and on a valid submit shows the "demo — nothing was sent" state with
the entered data preserved; privacy page loads and links back.

**Motion and resilience** — with `prefers-reduced-motion: reduce` nothing is hidden and parallax is
off; with JavaScript disabled all content is visible.

## Manual review

Each site was reviewed from desktop (1440) and mobile (390) screenshots of the hero and the full
page; desktop captures are in `reports/screenshots/`. Issues found and fixed during review:

- Shared: elements using the `clip`/`mask` reveal never appeared, because a fully clipped element
  reports no intersection. The runtime now observes the parent; the browser test was extended to
  catch this class of bug.
- service_03: missing space between a number and its noun in the hero facts; oversized address card.
- service_04: city name broke mid-word in the facts strip.
- service_05: mobile menu links were 43 px high.

## Size

Per site: about 37–40 kB CSS and 8.4 kB JavaScript (uncompressed), plus self-hosted font files
loaded per Unicode range. No framework runtime, no animation library.

## Not covered / known limits

- Contrast was designed to meet 4.5:1 and checked by eye on screenshots; no automated contrast or
  axe-core audit was run, and no screen-reader pass was done.
- Tested in Chromium only. Firefox and Safari were not run. Cross-document view transitions and
  `offset-path` degrade to no animation where unsupported.
- No Lighthouse/performance run.
- The live form path (`PUBLIC_FORM_ENDPOINT`) is covered by code review and unit tests of
  validation only; it was not exercised against a real endpoint because none exists.
- Russian copy was written and proof-read by the implementer, not by the businesses.

## Photo usage

No photographs are used on any site (none are approved locally).

| Site | Photo files used |
| --- | --- |
| service_01 – service_06 | none |
