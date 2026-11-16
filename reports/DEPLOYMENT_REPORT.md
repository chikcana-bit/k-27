# Deployment Report

Date: 15 November 2026

## Status at a glance

| Item | Status |
| --- | --- |
| Six sites built and passing QA locally | Done |
| GitHub repository | Pushed to the existing repository `chikcana-bit/k-27`, new branch `source/autoservice-six` (owner's choice). Existing branches `main`, `source/avtovatt`, `source/hybrid-center` were not changed. |
| Repository URL | https://github.com/chikcana-bit/k-27/tree/source/autoservice-six |
| Live hosting | Built output merged into `main` of `chikcana-bit/k-27` on 16 November 2026 as `service_01/` … `service_06/` (fast-forward, at the owner's request). Expected at `https://chikcana-bit.github.io/k-27/service_0N/`. **Not verified**: the build environment cannot reach `github.io`, and the Pages source setting could not be read. |
| GitHub Pages workflow | Present on the source branch (`.github/workflows/pages.yml`) but not used: publishing follows the repository's existing layout (built files committed to `main`). |
| CI workflow | Present on the source branch (`.github/workflows/ci.yml`); not active because it is not on the default branch. |

See `HANDOFF.md` for the republishing steps.

## Site paths

| Site | Source | Build output | URL |
| --- | --- | --- | --- |
| DetailTeamServis | `sites/service_01` | `sites/service_01/dist` | see HANDOFF.md |
| 360 | `sites/service_02` | `sites/service_02/dist` | see HANDOFF.md |
| Luxury Styling & Detailing | `sites/service_03` | `sites/service_03/dist` | see HANDOFF.md |
| Avtomaks Mobile Center | `sites/service_04` | `sites/service_04/dist` | see HANDOFF.md |
| ProSTO | `sites/service_05` | `sites/service_05/dist` | see HANDOFF.md |
| ZigZag | `sites/service_06` | `sites/service_06/dist` | see HANDOFF.md |

## Build commands

```bash
npm install
```

```bash
npm run build
```

```bash
npm run build:pages
```

`npm run build` writes six independent static sites. `npm run build:pages` writes one combined
folder `dist-pages/` (`/<service_id>/` per site plus an internal index) for a single host.

## How the sites were published

Option A — follow the existing `k-27` layout: build with the repository sub-path and copy the
output into `main` next to the existing sites.

```bash
PAGES_ORIGIN=https://chikcana-bit.github.io PAGES_BASE=/k-27 npm run build:pages
```

This writes `dist-pages/service_01/` … `service_06/`, which would become
`https://chikcana-bit.github.io/k-27/service_01/` … once committed to `main`. The preview is built
with `PUBLIC_PREVIEW=1` (`noindex`). The `index.html` and `robots.txt` in `dist-pages/` must not
replace the ones already on `main`.

Option B — host each site separately (any static host) from `sites/<id>/dist`.

## Before any production launch (per business)

- Written permission for photographs, then add them (README → "Adding approved photos").
- Confirm prices, Russian address spelling, service names and opening hours (`reports/DATA_AUDIT.md`).
- Provide a form endpoint plus personal-data operator details, or keep the form in demo mode.
- Set `SITE_URL` to the final domain (and drop `PUBLIC_PREVIEW`) so canonical URLs, sitemap and
  indexing are enabled.
- Consider whether each business has agreed to a website being published in its name.
