# Six Automotive Service Websites

Six independent, production-quality websites for automotive service businesses in
Komsomolsk-on-Amur, built as one product family on a shared design system.
Customer-facing copy is Russian; code and documentation are English.

| Site | Business | Art direction | Path |
| --- | --- | --- | --- |
| `service_01` | DetailTeamServis | Shade | `sites/service_01` |
| `service_02` | 360 | Orbit | `sites/service_02` |
| `service_03` | Luxury Styling & Detailing | Atelier | `sites/service_03` |
| `service_04` | Avtomaks Mobile Center | Signal | `sites/service_04` |
| `service_05` | ProSTO | Blueprint | `sites/service_05` |
| `service_06` | ZigZag | Pulse | `sites/service_06` |

## Stack

The package arrived with data only (no existing code), so the stack was chosen fresh:

- **Astro 7 + TypeScript**, static output: typed, reusable components, zero framework
  JavaScript shipped; each site is plain HTML/CSS plus about 8 kB (uncompressed) of shared motion and form script.
- **npm workspaces**: `shared/` (design system) and `sites/*` (one Astro project per business,
  each independently buildable and deployable).
- **Self-hosted fonts** via Fontsource (Cyrillic subsets, no third-party requests at runtime).
- No animation library: motion is CSS transforms/opacity driven by one small IntersectionObserver runtime.

## Structure

```
data/                  source records (single source of truth, with services/)
services/service_XX/   profile.json, README.md, photos/ (approved first-party photos go here)
shared/                tokens/  components/  motion/  layouts/  lib/   -> see shared/README.md
sites/service_XX/      src/content.ts (Russian copy)  src/site.ts  src/styles/theme.css
                       src/components/Hero.astro  src/pages/{index,privacy}.astro
scripts/               run.mjs  build-pages.mjs  validate-data.mjs  validate-dist.mjs  serve-dist.mjs  screenshot.mjs
tests/                 unit/ (node:test)  e2e/smoke.mjs (Playwright)
reports/               DATA_AUDIT.md  DESIGN_VARIATIONS.md  QA_REPORT.md  DEPLOYMENT_REPORT.md
```

## Setup

Requires Node.js 22.18+.

```bash
npm install
```

```bash
npm run dev -- service_01
```

```bash
npm run build
```

Build one site only: `npm run build -- service_03`. Output: `sites/<id>/dist/`.
Preview a build: `node scripts/serve-dist.mjs sites/service_03/dist 4321`.

## Quality checks

| Command | What it does |
| --- | --- |
| `npm run validate:data` | Profiles match `data/services.json`; photo approvals are consistent. |
| `npm run lint` | ESLint (TS + scripts) and Prettier. |
| `npm run check` | `astro check` (TypeScript + templates) for every site. |
| `npm test` | Unit tests: price/rating/hours parsing, copy-to-data alignment, form validation. |
| `npm run validate:dist` | Built HTML contains only verified facts: every price from the profile and no other amounts, no phone/messenger links, no hot-linked media, disclaimer and demo label present. |
| `npm run test:e2e` | Playwright smoke tests at 375/768/1440: console errors, external requests, overflow, reveals, touch targets, mobile menu, form states, reduced motion, no-JS. |
| `npm run qa` | All of the above in order. |

`npm run test:e2e` needs Playwright: `npm i --no-save playwright && npx playwright install chromium`.

## Data rules built into the code

- Business facts come only from `services/<id>/profile.json`. `shared/lib/model.ts` derives
  prices, rating and opening hours from it; `src/content.ts` supplies Russian labels only, and
  the build fails if labels do not line up with the profile.
- Phone numbers are masked in the source, so no site shows a number or a `tel:` link. Messengers
  are listed by name only. The contact action is the business's own 2GIS listing.
- Opening hours appear only where the full schedule is recorded (ProSTO).
- Prices always carry the "not a public offer" note and a link to the live price list.

## Adding approved photos

No photographs are bundled: none were supplied locally and the 2GIS URLs in
`PHOTO_ASSETS_MANIFEST.json` are references, not a licence. Once a business grants permission:

1. Put the original files in `services/<id>/photos/`.
2. List them in that service's `profile.json`:
   ```json
   "approved_photos": [
     { "file": "workshop-01.jpg", "alt_ru": "Описание того, что на фото", "usage": "gallery" }
   ]
   ```
   (`approved_photos` lives only in `profile.json`; `data/services.json` stays unchanged.)
3. Rebuild. The gallery section appears automatically with responsive, lazily loaded images.

`npm run validate:data` fails if a photo is on disk but not approved, or approved but missing.

## Lead form

Without configuration the form is a clearly labelled **frontend demo**: nothing is sent; the
visitor receives the composed request text to copy or e-mail. To make it live, build with:

```bash
PUBLIC_FORM_ENDPOINT="https://example.com/your-endpoint" \
PUBLIC_OPERATOR_NAME="Legal name of the data operator" \
PUBLIC_OPERATOR_CONTACT="contact for personal-data requests" \
npm run build -- service_01
```

The endpoint receives `POST` JSON `{ name, contact, service, message, consent, business, page }`
and must answer 2xx. The build refuses to produce a live form without operator details, because
the privacy page (152-FZ) needs them.

## Deployment

Each site is a static folder (`sites/<id>/dist`) and can be hosted anywhere.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production origin. Enables canonical URLs, `sitemap.xml` and an indexable `robots.txt`. Without it the build is `noindex`. |
| `BASE_PATH` | Sub-path when the site is not at the domain root, e.g. `/service_01/`. |
| `PUBLIC_PREVIEW=1` | Keeps a build with `SITE_URL` out of search engines (demo deployments). |

All six on one host (e.g. GitHub Pages): `npm run build:pages` writes `dist-pages/` with every
site under `/<id>/` and an internal index. `.github/workflows/pages.yml` does this on manual
dispatch. See `reports/DEPLOYMENT_REPORT.md` for current status and remaining steps.

## Source package

The original data package notes are kept in `DATA_PACKAGE_README.md`, `README_RU.md`,
`SOURCE_LINKS_AND_LIMITATIONS.md`, `PHOTO_DOWNLOAD_GUIDE_EN.md` and `PROMPT_FOR_CLAUDE_CODE_EN.md`.
