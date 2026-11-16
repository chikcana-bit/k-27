# Handoff — 24 Artem Automotive Service Websites

State as of 16 November 2026.

| Branch | Contents |
| --- | --- |
| `source/artem-24` | **This project's source**: Artem data pack, shared design system with six templates, 24 Astro sites, scripts, tests, reports. Work here. |
| `source/autoservice-six` | The earlier Komsomolsk-on-Amur six sites the templates were derived from. |
| `main` | What GitHub Pages serves. Built output of this project lives in `artem/service_01/` … `artem/service_24/`. Do not edit those folders by hand; rebuild and copy. |

Public addresses: `https://chikcana-bit.github.io/k-27/artem/service_XX/` (review index:
`https://chikcana-bit.github.io/k-27/`).

## Republishing after a change

1. On `source/artem-24`: make the change, run `npm run qa`, commit, push.
2. `PAGES_ORIGIN=https://chikcana-bit.github.io PAGES_BASE=/k-27/artem npm run build:pages`
3. Copy `dist-pages/service_XX` over `artem/service_XX` on `main`, delete each site's
   `robots.txt`, commit and push `main`.
4. Run `npm run build` afterwards so `sites/*/dist` is back to root-path builds for local tests.

## Rules that must keep holding

- Business facts come only from `services/<id>/profile.json`. `public_research` is an evidence
  layer: only verified business websites (and, for СТО Стандарт, the hours and e-mail on it) are used.
- No prices until a business confirms them.
- No photographs unless the file is in `services/<id>/photos/` **and** listed under
  `approved_photos` in that profile.

## Open items — owner decisions needed

See `reports/QA_REPORT.md` → "Owner decisions". In short: 12 data discrepancies from the
enrichment report, names for the two unbranded services and the two car washes, Totachi's identity,
Saturn's phone format, and permission/photos/prices/hours for every business.
