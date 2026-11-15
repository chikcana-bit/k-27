# Project Package: Six Automotive Service Websites

All documentation and structured data in this package are in English. The six customer-facing websites are intended for local customers in Komsomolsk-on-Amur and must therefore display their content in natural Russian.

The exact 2GIS business profiles were checked on 15 November 2026. Records are matched by the firm IDs resolved from the six supplied short links.

## Package contents
- `PROMPT_FOR_CLAUDE_CODE_EN.md` — master implementation prompt for Claude Code.
- `data/services.json` and `data/services.csv` — translated business details and price excerpts.
- `services/service_01` through `services/service_06/profile.json` — structured business records for each website.
- `services/service_*/photos/` — folders for approved original photographs.
- `PHOTO_ASSETS_MANIFEST.json` — direct URLs for photos marked by 2GIS as uploaded by the business owner.
- `PHOTO_DOWNLOAD_GUIDE_EN.md` — photo-source and usage instructions.
- `SOURCE_LINKS_AND_LIMITATIONS.md` — source links and verified data limitations.

## Important limitations
2GIS masks full phone numbers in its accessible text view. No readable price list was available for Avtomaks Mobile Center. The photo manifest contains direct image URLs, not local image files. The 2GIS owner-uploaded label identifies the uploader but does not grant a separate licence for republication on a commercial website.

Prices may change and are not a public offer. Confirm all prices, contact details, opening hours, and photo permissions with each business before launch.
