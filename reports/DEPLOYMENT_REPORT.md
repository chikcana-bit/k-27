# Deployment Report

Date: 15 November 2026

## Status at a glance

| Item | Status |
| --- | --- |
| Six sites built and passing QA locally | Done |
| Local git repository with full history | Done (`main` branch, no remote) |
| GitHub repository | **Not created** — GitHub authentication is not available in the build environment (`gh` reports an invalid token). No remote was added or changed. |
| Live hosting | **Not deployed.** Nothing is live. |
| GitHub Pages workflow | Prepared (`.github/workflows/pages.yml`), manual trigger only, not run |
| CI workflow | Prepared (`.github/workflows/ci.yml`), runs `npm run qa` |

Pushing code to GitHub will not by itself make any site live: Pages must be enabled and the
deploy workflow started by hand.

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

## Publishing to GitHub (owner steps)

1. Create an empty repository (decide the name and public/private visibility) and connect it:
   ```bash
   git remote add origin https://github.com/<owner>/<repo>.git
   ```
   ```bash
   git push -u origin main
   ```
2. For a preview on GitHub Pages: repository Settings → Pages → Source: **GitHub Actions**, then
   Actions → "Deploy preview to GitHub Pages" → Run workflow. Sites appear at
   `https://<owner>.github.io/<repo>/service_01/` … `/service_06/`. The preview is built with
   `PUBLIC_PREVIEW=1`, so pages are `noindex` and `robots.txt` disallows crawling.
   GitHub Pages on a private repository requires a paid plan.

## Before any production launch (per business)

- Written permission for photographs, then add them (README → "Adding approved photos").
- Confirm prices, Russian address spelling, service names and opening hours (`reports/DATA_AUDIT.md`).
- Provide a form endpoint plus personal-data operator details, or keep the form in demo mode.
- Set `SITE_URL` to the final domain (and drop `PUBLIC_PREVIEW`) so canonical URLs, sitemap and
  indexing are enabled.
- Consider whether each business has agreed to a website being published in its name.
