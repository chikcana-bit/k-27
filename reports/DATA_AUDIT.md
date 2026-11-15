# Data Audit — Six Automotive Service Websites

Audit date: 2026-11-15

## 1. Scope and method

- **Local files only.** No web access was used; no URL was fetched. Nothing in the package was re-verified against 2GIS. "Verified" below means "stated consistently in the package as taken from the 2GIS listing", not "confirmed by the business".
- Files read: `data/services.json`, `data/services.csv`, `services/service_01..06/profile.json` and `README.md`, `PHOTO_ASSETS_MANIFEST.json`, `SOURCE_LINKS_AND_LIMITATIONS.md`, `PHOTO_DOWNLOAD_GUIDE_EN.md`, `README.md`. Not audited: `README_RU.md`, `PROMPT_FOR_CLAUDE_CODE_EN.md`.
- Method: a Python script (run with `python3 -I`, kept outside the project) compared, per service: every key of `services.json` against `profile.json` (deep equality); the shared columns against `services.csv`; the header fields, price lines and photo count parsed from each service `README.md`; and name, gallery URL and URL counts against the photo manifest and the source-links document. Price strings were checked against the dominant pattern `[from ]RUB n,nnn[–n,nnn]`.
- No existing file was modified. No gap was filled by assumption.

## 2. Consistency check

### 2.1 Overall result

| Service | json = profile.json | json = csv | json = README | Manifest / source-links |
|---|---|---|---|---|
| service_01 DetailTeamServis | identical | identical | identical | consistent |
| service_02 360 | identical | identical | identical | **name differs** |
| service_03 Luxury Styling & Detailing | identical | identical | identical (anomaly repeated) | consistent |
| service_04 Avtomaks Mobile Center | identical | identical (null vs empty) | identical | key spelling differs |
| service_05 ProSTO | identical | identical | identical | consistent |
| service_06 ZigZag | identical | identical | identical | consistent |

Name, category, address, phone string, email, messengers, hours, rating, `price_count`, `photo_count`, all three URLs and every price line agree across `services.json`, `services.csv`, `profile.json` and the service README for all six businesses. All three URLs of each service carry one and the same firm ID and all appear in `SOURCE_LINKS_AND_LIMITATIONS.md`. The four files are copies of one dataset, so their agreement does not independently confirm any value.

### 2.2 Discrepancies and anomalies

| # | Where | Finding |
|---|---|---|
| D1 | service_02 name | `"360"` in services.json, services.csv, profile.json, README title and `PHOTO_DOWNLOAD_GUIDE_EN.md`; `"360 Detailing Studio"` in `PHOTO_ASSETS_MANIFEST.json` (`business_name`) and in the `SOURCE_LINKS_AND_LIMITATIONS.md` heading. The official trading name is not established by the package. |
| D2 | service_03 price format | `Interior deep cleaning` = `"from 12 000 ₽"` (space as thousands separator, ₽ sign) in services.json, profile.json and README. All other 56 price strings use `RUB 12,000` style. The amount is not in doubt, only the format; a numeric parser expecting `RUB n,nnn` will fail on it. |
| D3 | service_05 price count | `price_count` = 31 (json, csv, profile) but only **16** price items are listed (json, profile, README). The notes state the full 2GIS list has 31 items and the package holds a selection. 15 items are absent from the package. |
| D4 | service_04 price count | `price_count` is `null` in json/profile, an empty cell in csv; `prices` is an empty list; README says "No verified prices were available". Consistent in meaning, different representation. |
| D5 | service_04 price URL | `price_url` ends in `/tab/menu`; the other five end in `/tab/prices`. The source-links document says this tab exposed no readable prices. |
| D6 | service_04 manifest key | Manifest key is `service_04_automaks`; the business name everywhere is `Avtomaks`. |
| D7 | Email representation | Where no email exists (services 01, 04, 05): `null` in json/profile, empty in csv, text `"Not listed in the accessible 2GIS text"` in README. Same meaning, three representations. |
| D8 | Photo counts: profile vs manifest | `photo_count` in the profiles is the total 2GIS gallery count (owner + user photos). The manifest counts owner-uploaded items only, and holds fewer URLs still. See table 2.3. The two numbers measure different things and must not be mixed. |
| D9 | Manifest schema | service_03 uses different keys (`owner_items_reported`, `owner_items_sampled`, `video_items_excluded`, `extracted_unique_image_urls`) from the other five (`owner_photo_count_reported`, `extracted_urls`). Code reading the manifest must handle both. |
| D10 | service_03 rating | `"4.9/5 (145–146 ratings; count varies on the listing)"` — the rating count is not a single value. |
| D11 | service_03 hours wording | `"closed and opening at 10:00"`; services 01, 02, 04, 06 say `"opening tomorrow at ..."`. Wording only; in all five cases the weekly schedule was not retrieved. |
| D12 | Notes wording | `verified_notes` differs slightly from the "Verified:" lines in the source-links document for service_02 ("; it is not" vs "and is not") and service_05 ("this file" vs "this package"). No factual difference. |
| D13 | Phone mask format | Services 01, 02, 03, 06 show a mobile prefix with six digits (`+7‒994‒134…` etc.). Services 04 and 05 show only `+7 (4217…`, i.e. the same four-digit prefix for both and no subscriber digits. |
| D14 | CSV coverage | `services.csv` has no `services` or `prices` columns; it carries only counts. The file starts with a UTF-8 BOM. |
| D15 | Services vs prices | Listed services with no price item: service_06 "Installation of Pandora and StarLine security systems (according to the listing description)"; service_04 has no service list at all (the single `services` entry is a statement that none was available). service_01 has category "Car detailing" but its only listed service and all three prices are window tinting. |
| D16 | service_05 photo dates | `PHOTO_DOWNLOAD_GUIDE_EN.md` states that some dates in the ProSTO gallery displayed anomalously and must not be used without re-checking. |
| D17 | Addresses | Addresses exist only in English form (e.g. "5V Basic Street", "8/3G Alleya Truda Street"). The original Russian spelling of street names is not in the package, while the websites are to be in Russian. |

No duplicate price item names, no duplicate or malformed image URLs (64 URLs, 64 unique) and no stray whitespace were found.

### 2.3 Photo counts

| Service | `photo_count` (profile/json/csv/README) | Owner items reported (manifest) | URLs in manifest | Manifest status |
|---|---|---|---|---|
| 01 DetailTeamServis | 49 | 9 | 9 | complete for visible owner gallery |
| 02 360 | 33 | 24 | 19 | partial, 19 of 24 |
| 03 Luxury Styling & Detailing | 187 | 78 | 11 | 15 of 78 sampled, 11 unique images, 1 video excluded |
| 04 Avtomaks Mobile Center | 12 | 4 | 4 | complete for visible owner photos |
| 05 ProSTO | 36 | 17 | 16 | 16 unique URLs of 17 items |
| 06 ZigZag | 63 | 39 | 5 | partial, 5 of 39 |

The manifest counts match `PHOTO_DOWNLOAD_GUIDE_EN.md` exactly. Local image files: **none**. No `services/service_XX/photos/` directory exists for any service; each service folder contains only `README.md` and `profile.json`. No `profile.json` has any field marking an image as approved or first-party. The manifest and the guide both state that the URLs are source references and that the "Owner-uploaded" label is not a licence to republish.

## 3. Field status per business

Legend: **V** = verified (present, consistent in all files, stated as taken from 2GIS); **P** = partial; **M** = missing.

| Field | 01 DetailTeamServis | 02 360 | 03 Luxury Styling | 04 Avtomaks | 05 ProSTO | 06 ZigZag |
|---|---|---|---|---|---|---|
| Name | V | P (D1: "360" vs "360 Detailing Studio") | V | V | V | V |
| Category | V | V | V | V | V | V |
| Address (English form) | V | V | V | V | V | V |
| Address in Russian | M | M | M | M | M | M |
| Full phone | P (masked `+7‒994‒134…`) | P (masked `+7‒914‒185…`) | P (masked `+7‒924‒110…`) | P (only `+7 (4217…`) | P (only `+7 (4217…`) | P (masked `+7‒962‒286…`) |
| Email | M (not listed) | V | V | M (not listed) | M (not listed) | V |
| Messenger names | V (WhatsApp, Telegram, Max) | V (Telegram, Max) | V (Telegram, WhatsApp, Max) | V (WhatsApp) | V (WhatsApp) | V (Telegram) |
| Messenger links/handles | M | M | M | M | M | M |
| Opening hours, full week | P (only "opens tomorrow 10:00") | P (only "opens tomorrow 10:00") | P (only "opens at 10:00") | P (only "opens tomorrow 09:00") | V ("Daily, 10:00–19:00") | P (only "opens tomorrow 09:00") |
| Rating | V (5.0, 52) | V (5.0, 42) | P (4.9, count 145–146) | V (5.0, 239) | V (4.8, 221) | V (4.9, 194) |
| Services list | P (1 item) | V (5) | V (12) | M (no list retrieved) | V (6) | V (4) |
| Prices | V (3 of 3) | V (15 of 15) | V (19 of 19; one format anomaly, D2) | M (none) | P (16 of 31) | V (4 of 4) |
| Price-list update date | M | V (16 Sep 2026) | V (13 May 2026) | M (no price list) | V (14 Nov 2026) | V (9 Mar 2026) |
| Approved local photos | M | M | M | M | M | M |
| Photo source URLs (unapproved) | 9 of 9 | 19 of 24 | 11 (15 of 78 sampled) | 4 of 4 | 16 of 17 | 5 of 39 |
| Map coordinates | M | M | M | M | M | M |

Notes: every rating is a snapshot from the check date. Every price is, per the package, subject to change and not a public offer. ProSTO hours come from a single statement in the listing; holiday hours are not given.

## 4. Missing fields and website consequences

Common to all six:

- **Full phone number missing** — no working `tel:` button and no displayable number. The masked fragments must not be completed or shown as a number.
- **Messenger links/handles missing** — only the messenger names are known, so no clickable WhatsApp / Telegram / Max button can be built. WhatsApp links cannot be derived either, since the phone numbers are incomplete.
- **Approved local photos missing** — no gallery, no hero photo, no before/after section. The manifest URLs cannot be published until permission is obtained, and stock or AI images are excluded by the package rules. Pages need a photo-free layout or a placeholder block.
- **Map coordinates missing** — no pinned embedded map from package data. Only the text address and a link to the 2GIS profile are available.
- **Russian address spelling missing** — the Russian-language sites cannot show the address in its original form without owner input; translating the English form back risks a wrong street name.

Per business:

**service_01 DetailTeamServis**
- Email missing — no email link, no mail-based contact form target.
- Weekly hours missing — hours block must read "contact for details"; no open/closed indicator; no `openingHours` structured data.
- Price-list update date missing — prices cannot carry an "updated on" note.
- Services list has one item (window tinting) under the category "Car detailing" — the services section can truthfully present tinting only; no other detailing service may be listed.

**service_02 360**
- Name unresolved ("360" vs "360 Detailing Studio") — page title, logo text, headings and SEO metadata cannot be finalised.
- Weekly hours missing — "contact for details".
- Photo URLs incomplete (19 of 24 owner items).
- Email present: an email link is possible. The address `wraplab27@gmail.com` does not contain the business name; the package does not explain this.

**service_03 Luxury Styling & Detailing**
- Weekly hours missing — "contact for details".
- Rating count ambiguous (145–146) — a single review count cannot be displayed.
- Price format anomaly on "Interior deep cleaning" — needs normalising at render time, amount unchanged.
- Photo URLs cover a small sample (11 images from 15 of 78 owner items).
- Notes mention estimated completion times on the price page, but none are in the package — no duration column possible.

**service_04 Avtomaks Mobile Center**
- Prices missing entirely — "request a quote" instead of a price table.
- Services list missing — only the category ("vehicle service and repair shop") can be stated; no service cards.
- Email missing — no email link.
- Weekly hours missing — "contact for details".
- Phone shows area-code prefix only — least contact data of the six; the only contact route from package data is the link to the 2GIS profile.

**service_05 ProSTO**
- 15 of 31 price items missing — the table must be labelled as a selection, or completed by the owner; it must not claim to be the full price list.
- Email missing — no email link.
- Phone shows area-code prefix only.
- Gallery dates flagged as anomalous — no photo dates may be shown.
- Hours are available ("Daily, 10:00–19:00"): this is the only site that can show a schedule.

**service_06 ZigZag**
- Weekly hours missing — "contact for details".
- Photo URLs cover 5 of 39 owner items.
- Security-system installation (Pandora, StarLine) has no price — "request a quote" for that service; the item itself comes from the listing description, not the price list.
- Price list dated 9 March 2026, the oldest of the six — higher risk of being out of date.

## 5. Owner TODO list (before launch)

For every business:

1. Supply the full phone number(s) in international format and confirm they may be published.
2. Supply messenger links or handles for each listed messenger (WhatsApp number, Telegram username/link, Max link), or confirm the messenger should be omitted.
3. Supply the full weekly opening schedule, including days off and breaks (ProSTO: confirm "Daily, 10:00–19:00").
4. Supply approved photos as files, or written permission to use the owner-uploaded 2GIS images, and state which images are approved. Place approved files in `services/service_XX/photos/`.
5. Confirm the current price list and its date; confirm that "from" prices and ranges are still correct.
6. Supply the address in Russian exactly as it should appear, and map coordinates or confirmation of the map pin.
7. Confirm the business name, category wording and the list of services as they should appear in Russian.
8. Confirm whether the 2GIS rating and review count may be displayed, and with what "as of" date.

Business-specific:

- **service_01 DetailTeamServis**: provide an email address or confirm there is none; confirm whether services other than window tinting are offered; provide the price-list date.
- **service_02 360**: decide the official name ("360" or "360 Detailing Studio"); confirm that `wraplab27@gmail.com` is the correct public email; supply the 5 owner photos not captured in the manifest if wanted.
- **service_03 Luxury Styling & Detailing**: confirm the "Interior deep cleaning" price (recorded as "from 12 000 ₽"); supply completion times if they should be shown; select photos (only 11 of 78 owner items are referenced).
- **service_04 Avtomaks Mobile Center**: supply a service list and a price list, or confirm a "request a quote" site; provide an email address or confirm there is none; confirm the name spelling ("Avtomaks").
- **service_05 ProSTO**: supply the remaining 15 price items or approve publishing a selection of 16; provide an email address or confirm there is none.
- **service_06 ZigZag**: confirm the prices dated 9 March 2026 are current; supply prices for security-system installation or confirm "on request"; select photos (only 5 of 39 owner items are referenced).

Project-level decisions:

- Normalise the price format (D2) and the empty-value representation (D4, D7) in the build step rather than by guessing content.
- Align the manifest naming (D1, D6) and handle both manifest schemas (D9).
