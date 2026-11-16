# Handoff — Six Automotive Service Websites

Read this first when picking the project up in a new session. State as of 16 November 2026.

## Where everything is

Repository: `chikcana-bit/k-27` (public).

| Branch | Contents |
| --- | --- |
| `source/autoservice-six` | **This project's source**: data, shared design system, six Astro sites, scripts, tests, reports. Work here. |
| `main` | What GitHub Pages serves. Holds the owner's earlier sites plus the **built** output of this project in `service_01/` … `service_06/`. Do not edit those folders by hand; rebuild and copy. |
| `publish/autoservice-six` | Branch used to carry the built output into `main`. Already merged; can be deleted. |
| `source/avtovatt`, `source/hybrid-center` | Other projects of the owner. Not part of this work. |

Expected public addresses (GitHub Pages, not verified from the build environment, which cannot reach `github.io`):

- https://chikcana-bit.github.io/k-27/service_01/ — DetailTeamServis
- https://chikcana-bit.github.io/k-27/service_02/ — 360
- https://chikcana-bit.github.io/k-27/service_03/ — Luxury Styling & Detailing
- https://chikcana-bit.github.io/k-27/service_04/ — Avtomaks Mobile Center
- https://chikcana-bit.github.io/k-27/service_05/ — ProSTO
- https://chikcana-bit.github.io/k-27/service_06/ — ZigZag

## Start working

```bash
git clone --branch source/autoservice-six https://github.com/chikcana-bit/k-27
```

```bash
npm install
```

```bash
npm run qa
```

`README.md` covers the stack, structure, commands, photo and form setup. `shared/README.md` is the
design-system contract. `reports/` holds the data audit, design variations, QA and deployment reports.

## Republishing after a change

1. On `source/autoservice-six`: make the change, run `npm run qa`, commit, push.
2. Build for the Pages path:
   ```bash
   PAGES_ORIGIN=https://chikcana-bit.github.io PAGES_BASE=/k-27 npm run build:pages
   ```
3. Copy `dist-pages/service_01` … `service_06` over the same folders on `main` (delete each
   site's own `robots.txt`; do **not** copy `dist-pages/index.html` or `dist-pages/robots.txt` —
   `main` has its own). Commit and push `main`, or go through a pull request.
4. Run `npm run build` afterwards so `sites/*/dist` is back to root-path builds for local tests.

## Rules that must keep holding

- Business facts come only from `services/<id>/profile.json`. No invented phones, messenger links,
  hours, prices, services or claims. `npm run validate:dist` enforces this on the built HTML.
- No photographs unless the file is in `services/<id>/photos/` **and** listed under
  `approved_photos` in that profile. No stock, AI-generated or hot-linked images.
- Site copy is Russian; code and documentation are English.
- `shared/` is common to all six sites: change it deliberately and re-run QA for all of them.

## Open items

- The six live addresses have not been opened and checked by anyone yet.
- The owner's review page (`index.html` on `main`) does not link to the six new sites.
- Russian address spellings were translated back from English and need the owner's confirmation
  (table in `reports/DATA_AUDIT.md`); two district names were left out as unverifiable.
- Each business should proof-read its Russian service names and confirm prices.
- No photos: permission from each business is needed first.
- Lead forms are demos. A real endpoint plus personal-data operator details are needed to send.
- Published builds are previews (`noindex`, root `robots.txt` disallows crawling).
- Not tested: Firefox/Safari, automated accessibility/contrast audit, Lighthouse.
- The repository is public, so the source data (names, addresses, e-mails) is publicly visible.
