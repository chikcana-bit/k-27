# QA Report — 24 Artem Sites

Date: 16 November 2026. Environment: Linux, Node 22, Chromium (Playwright).

## Results

| Check | Command | Result |
| --- | --- | --- |
| Data integrity (24 records, profile = master JSON, 6 templates × 4 sites, photos) | `npm run validate:data` | Pass |
| ESLint + Prettier | `npm run lint` | Pass |
| `astro check` (TypeScript + templates), 24 sites | `npm run check` | Pass — 0 errors, 0 warnings, 0 hints |
| Unit tests (phone parsing, model, form validation) | `npm test` | Pass |
| Production build, 24 sites | `npm run build` | Pass |
| Built-HTML rules, 24 sites | `npm run validate:dist` | Pass |
| Browser smoke tests at 375 / 768 / 1440 px | `npm run test:e2e` | Pass — 792 checks |
| Colour contrast of every variant (text, muted, accent, button, tag) | script, see below | Pass — all ≥ 4.5:1 |
| Visual review | screenshots of all six templates, including mirrored variants, desktop and mobile | Reviewed |

`validate:dist` fails a build if: a phone, address, name or service from the profile is missing or
altered; any other phone number appears; a `tel:` link points elsewhere; an external link is not
the map search or a verified business website; any rouble amount or clock time appears without a
source; marketing claims (best, guarantee, 24/7, years, ratings, reviews) appear; the demo form or
demo-concept notice is missing; images are hot-linked or unapproved.

The smoke tests check, per viewport: console errors, external requests at load, horizontal
overflow, content revealed after scrolling, touch target sizes, mobile menu, form states,
reduced motion and no-JS rendering.

Contrast was checked by computing WCAG ratios for each site's resolved tokens (template defaults +
variant overrides). Two Atelier variants (04, 14) were initially 4.3–4.4:1 on the address tag;
their swatch colour was darkened to 5.3:1.

## Not tested

- Firefox and Safari (`color-mix()` needs Safari 16.2+ / Firefox 113+).
- Live GitHub Pages URLs: the build environment cannot reach `github.io`.
- Screen-reader walkthrough and Lighthouse.

## Owner decisions

1. **Conflicting phones** — owner value shown; public sources differ: АвтоМир Приморье
   (+7 423 279-00-70 on its site), Авторитет-Авто+ (+7 423 279-09-79 on its site), Гиперавто
   (branch: store +7 (42337) 4-20-20, service +7 (423) 202-89-02; owner gave the 8 800 hotline),
   Мой Сам (directory number masked). Extra directory numbers not added: Автохит
   +7 908 977-33-44, Totachi +7 902 556-74-70.
2. **Conflicting addresses** — owner value shown: Art Master (directory: Фрунзе, 45), АвтоЛют
   (directory: «стр. 2»), VISTA (directory: 30А).
3. **Names** — confirm public names for «Автомойка / CarShine» (16) and «Автомойка» (17); brand
   names for the two unbranded services (22, 24, shown as «Автосервис»); whether Totachi (23) is the
   business name; whether АвтоМаксимум (12) is the «Auto-Maks» listing.
4. **Saturn phone** `+7 42337 4-30-37` — shown exactly as supplied; a directory uses the same format.
5. **Not supplied for anyone** — website URLs (except four found pages), hours (except СТО Стандарт),
   prices, e-mails (except СТО Стандарт), photos, social links. Pilot and АвтоЛют third-party price
   estimates were not published.
6. **Permission** — these are demo concepts (footer notice). Each business should confirm before
   anything is promoted; the repository is public.
7. **Lead forms** — demo mode. A real endpoint plus operator details are needed to receive requests.
