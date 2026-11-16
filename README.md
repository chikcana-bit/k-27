# Artem Automotive Services — 24 Websites

Twenty-four separate websites for automotive service businesses in Artem, Primorsky Krai, built
from the six designs of the earlier Komsomolsk-on-Amur set (`source/autoservice-six`). Each design
became a reusable template; every business gets its own site instance with its own colour
variant and, on half of the sites, a mirrored hero composition. Customer-facing copy is Russian;
code and documentation are English.

| Template | Concept | Sites |
| --- | --- | --- |
| Shade | Light through tinted glass (car washes) | 15 Пилот, 16 Автомойка / CarShine, 17 Автомойка, 18 Мой Сам |
| Orbit | A full turn around the car (multi-service centres) | 05 СТО Стандарт, 19 АвтоМир Приморье, 20 Авторитет-Авто+, 21 Гиперавто |
| Atelier | Craft workshop, stitched seams (body, paint, detailing) | 03 АвтоЛига, 04 АвтоДиз, 06 Art Master, 14 Кракен |
| Signal | Typographic poster, hazard stripes (general repair) | 01 Автоцентр Хадо, 10 Омега-Сервис, 11 Сатурн, 13 СТО VISTA |
| Blueprint | Technical drawing sheet (mechanical repair) | 09 Mobil-Артем, 12 АвтоМаксимум, 22 Автосервис, 23 Totachi |
| Pulse | Diagnostic trace (electrics and diagnostics) | 02 Автохит, 07 АвтоЛют, 08 Автодом, 24 Автосервис |

Full mapping, colours and layout variants: `reports/DESIGN_VARIATIONS.md`.

## Structure

```
data/                  services.json/.csv (owner data pack), site-plan.json (template per site)
services/service_XX/   profile.json (single source of truth), PROMPT_EN.md, photos/ (approved photos only)
shared/                tokens/ components/ motion/ layouts/ lib/ templates/   -> shared/README.md
sites/service_XX/      src/content.ts (Russian wording), src/site.ts, src/styles/variant.css, src/pages/*
scripts/               run.mjs build-pages.mjs validate-data.mjs validate-dist.mjs serve-dist.mjs screenshot.mjs
tests/                 unit/ (node:test)  e2e/smoke.mjs (Playwright)
docs/data-pack/        the original data-pack prompt and README
reports/               audits, changelog, design variations, QA
```

## Commands

Requires Node.js 22.18+.

```bash
npm install
```

```bash
npm run build
```

```bash
npm run qa
```

`npm run build -- service_07` builds one site; output goes to `sites/<id>/dist/`. `npm run qa` runs
data validation, lint, `astro check`, unit tests, build, built-HTML validation and browser smoke tests.

## Data rules built into the code

- Name, address, phone(s) and service list come only from `services/<id>/profile.json` and are shown
  exactly as supplied (services get a capital first letter for display).
- Phones are call links. No other numbers, messengers or e-mails appear, except the e-mail and
  hours stated on СТО Стандарт's own website (shown with that source).
- No prices: no business has a confirmed price list, so every site says
  «Стоимость уточняйте по телефону».
- A business website is linked only when the research found a direct business page
  (05, 19, 20, 21). Directory and map links are never shown as websites.
- "Адрес на карте" is a Yandex Maps search for the address, not coordinates.
- `npm run validate:dist` enforces all of this on the built HTML.

## Deployment

`PAGES_ORIGIN=https://chikcana-bit.github.io PAGES_BASE=/k-27/artem npm run build:pages` writes
`dist-pages/` with every site under `/<id>/`. Copy `dist-pages/service_XX` to `artem/service_XX` on
`main` (delete each site's own `robots.txt`). See `HANDOFF.md`.

Lead forms are demos until `PUBLIC_FORM_ENDPOINT` and operator details are set (see
`shared/lib/env.ts`).
