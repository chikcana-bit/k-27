# Shared design system (`@autoservice/shared`)

Frozen after the `service_01` reference site passed QA. All six sites consume it;
changes here affect every site, so they go through the integration owner.

## Contract

| Area | Files | Rule |
| --- | --- | --- |
| Tokens | `tokens/tokens.css` | Primitives are fixed. Sites override **semantic** (`--c-*`, `--font-display`, `--display-*`, `--step-3..5`) and **component** (`--btn-*`, `--card-*`, `--field-*`) tokens in `sites/<id>/src/styles/theme.css`. |
| Base | `tokens/base.css` | Reset, type roles, layout primitives: `.container`, `.container--narrow`, `.section`, `.section--alt`, `.section--tight`, `.split` (`--split`), `.stack` (`--stack-gap`), `.cluster`, `.eyebrow`, `.lead`, `.muted`, `.sr-only`. |
| Components | `tokens/components.css` + `components/*.astro` | Styles live in the `components` cascade layer; site themes are unlayered and therefore always win. Re-skin through tokens first, extra selectors second. |
| Motion | `motion/motion.css`, `motion/motion.ts` | Attribute API below. Never add hidden states outside `html.js` + `prefers-reduced-motion: no-preference`. |
| Data | `lib/model.ts`, `lib/types.ts` | `buildSite(profile, content)` derives prices, rating and hours from `services/<id>/profile.json`. Copy only supplies Russian labels; amounts are never retyped. |
| Deploy | `lib/site-config.mjs`, `lib/env.ts`, `lib/seo.ts` | `SITE_URL`, `BASE_PATH`, `PUBLIC_FORM_ENDPOINT`, `PUBLIC_OPERATOR_NAME`, `PUBLIC_OPERATOR_CONTACT`. |

Breakpoints (em, mobile-first): `40em` (two-column fields), `48em` (tablet), `60em` (desktop nav + `.split`).

## Components

| Component | Props | Notes |
| --- | --- | --- |
| `layouts/BaseLayout.astro` | `site`, `title`, `description?`, `themeColor?`, `noindex?` | Slots: `head`, `header`, default, `footer`. |
| `SiteHeader.astro` | `site`, `nav`, `cta?`, `home?` | Slot `mark` for a graphic brand mark. Animated mobile menu, scroll-spy, progress bar. |
| `SiteFooter.astro` | `site`, `nav`, `home?` | Source/"not a public offer" notice. |
| `SectionHead.astro` | `title`, `eyebrow?`, `index?`, `lead?`, `center?`, `id?` | Split-word animated `h2`. |
| `ServiceList.astro` | `items`, `variant: cards \| rows \| tags` | Renders nothing for an empty list. |
| `PriceList.astro` | `site`, `variant: plain \| leaders \| cards`, `rows?`, `showNote?` | Uses `site.priceGroups` when configured. Always keeps the disclaimer once per page. |
| `QuotePanel.astro` | `title?`, `text?` | For businesses without a verified price list. |
| `RatingBadge.astro` | `site` | Rating + check date, links to the 2GIS listing. |
| `ContactPanel.astro` | `site` | Address, hours (only if the full schedule is verified), messenger names (not links), e-mail, 2GIS button. |
| `LeadForm.astro` | `site`, `options?`, `submitLabel?` | Demo mode unless `PUBLIC_FORM_ENDPOINT` is set. |
| `Gallery.astro` | `photos`, `files` | Approved local photos only; renders nothing otherwise. |
| `CtaBand.astro` | `title`, `text?`, `href?`, `label?` | Slot `decor`. |
| `PrivacyContent.astro` | `site` | Demo vs live policy text. |
| `Icon.astro` | `name` | arrow, external, pin, clock, mail, chat, star, info, check. |

## Motion attributes

- `data-reveal="up|fade|left|right|scale|mask|clip"` — one-shot entrance; `style="--reveal-delay: 300ms"` to offset.
- `data-stagger` on a parent — its `[data-reveal]` descendants enter in sequence.
- `data-split` on a heading — words rise from a mask (accessible name preserved).
- `data-parallax="0.1"` — slow vertical drift (negative values move the other way).
- `data-spotlight` — exposes pointer position as `--mx` / `--my`.

Durations and easings come from `--dur-1..4`, `--ease-out`, `--ease-in-out`.
`prefers-reduced-motion: reduce` collapses all transitions/animations and disables parallax.
