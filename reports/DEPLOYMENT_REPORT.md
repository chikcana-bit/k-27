# Deployment Report

Date: 15 November 2026

## Status at a glance

| Item | Status |
| --- | --- |
| Six sites built and passing QA locally | Done |
| GitHub repository | Pushed to the existing repository `chikcana-bit/k-27`, new branch `source/autoservice-six` (owner's choice). Existing branches `main`, `source/avtovatt`, `source/hybrid-center` were not changed. |
| Repository URL | https://github.com/chikcana-bit/k-27/tree/source/autoservice-six |
| Live hosting | **Not deployed.** Nothing from this project is live. |
| GitHub Pages workflow | Present on the branch (`.github/workflows/pages.yml`) but not runnable: GitHub only offers manually triggered workflows that exist on the default branch. |
| CI workflow | Present on the branch (`.github/workflows/ci.yml`); runs on pull requests and on pushes to `main`. |

`k-27` is a public repository whose `main` branch holds already-built sites (it has `.nojekyll`,
`index.html` and site folders), which suggests `main` is what GitHub Pages serves. Publishing these
six sites there means adding their built output to `main`; that changes a live public site and was
not done without an explicit go-ahead.

## Site paths

| Site | Source | Build output | URL |
| --- | --- | --- | --- |
| DetailTeamServis | `sites/service_01` | `sites/service_01/dist` | none yet |
| 360 | `sites/service_02` | `sites/service_02/dist` | none yet |
| Luxury Styling & Detailing | `sites/service_03` | `sites/service_03/dist` | none yet |
| Avtomaks Mobile Center | `sites/service_04` | `sites/service_04/dist` | none yet |
| ProSTO | `sites/service_05` | `sites/service_05/dist` | none yet |
| ZigZag | `sites/service_06` | `sites/service_06/dist` | none yet |

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

## Making the sites live (not done)

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
