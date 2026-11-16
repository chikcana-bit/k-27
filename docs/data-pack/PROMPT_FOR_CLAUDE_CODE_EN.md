# MASTER PROMPT — UPDATE 24 EXISTING AUTOMOTIVE SERVICE WEBSITES

You are a senior frontend engineer and data migration specialist working inside Claude Code.

## Mission
Update the business content of **24 existing, separate automotive-service websites in Artem, Primorsky Krai, Russia** using the repository's existing template and architecture.

**TEMPLATE-BASED ROLLOUT. Do not design websites from scratch or invent new visual concepts. Reuse the existing website template to provide one separate site instance per business. The only per-business differences should be the business data and the minimum configuration required to identify/deploy each instance.**

Input files:
- `data/services.json`
- `data/services.csv`
- `services/service_01/profile.json` through `services/service_24/profile.json`

## 1. Preserve the existing template
Before editing, inspect the repository, identify the current template, site count, routing, data schema, assets, components, styling, animations, responsive behavior, dependencies, build system, and deployment setup.

Preserve the existing page structure, section order, layout, spacing, typography, colors, backgrounds, animations, transitions, masks, hover states, components, interactions, responsive breakpoints, routes, dependencies, and deployment configuration.

Do not design websites from scratch, add new visual concepts, redesign, restyle, modernize, change CSS/design tokens/component markup/animation code, replace the stack, or add dependencies. Creating separate site instances from the existing template is allowed and required only when needed to provide one site per business. Do not merge distinct businesses into one site. Do not change presentation code unless strictly necessary to prevent content breakage; document any exception.

## 2. Required workflow
1. Audit the repository before editing.
2. Determine whether the repository contains 24 existing site instances or one reusable site template.
3. If 24 site instances already exist, map the records to them in order: `service_01` through `service_24`.
4. If the repository contains one reusable template, create 24 separate instances by reusing/copying that exact template and changing only each instance's business data and required deployment identifier/configuration. Do not create new designs or page compositions.
5. If the repository contains neither 24 instances nor a clear reusable template, STOP and report the mismatch before editing.
6. Adapt the supplied records to the existing schema without changing the UI.
7. Create `reports/PRE_UPDATE_AUDIT.md`.
8. Update business data and only the minimum instance configuration needed.
9. Create `reports/DATA_CHANGELOG.md` listing every site and changed field.
10. Run existing lint, tests, validation, and production build.
11. Create `reports/QA_REPORT.md`.

## 3. Data rules
Use owner-provided values as the source of truth. Preserve Russian business names, addresses, and phone numbers exactly.

Never invent URLs, emails, social links, hours, prices, discounts, warranties, certifications, years in business, reviews, ratings, staff, equipment, extra services, map coordinates, or promotional claims.

A note that a website/page exists is not its URL. Keep `website_url` empty until the exact URL is supplied or verified by the owner. Keep all supplied facts marked unverified unless evidence is provided. Use the template's existing neutral fallback for missing fields and document gaps.

Special cases:
- AvtoLiga is one business and one site only. Use `ул. Дежнёва, 60А, стр. 8` and `+7 902 555-07-97`.
- Saturn phone `+7 42337 4-30-37` must remain exactly as supplied and be flagged for verification.
- Keep generic/unbranded listings neutral; do not invent brand names.
- Confirm whether Totachi is the business name or an associated product brand.
- Do not guess website URLs for any business.

## 4. Language and assets
Customer-facing content must remain Russian. Prompts, reports, file names, code comments, and data keys must be English. Preserve existing image assignments and assets. Do not fetch, generate, or substitute photographs.

Preserve existing forms and integrations. Do not claim forms work unless connected to a real backend. Do not alter secrets, API keys, environment variables, or credentials.

## 5. Git safety
Inspect git status, branches, and remotes. Do not discard user changes, overwrite unrelated work, force-push, change remotes, commit, publish, or deploy without authorization.

## 6. Final report
List the 24 site identifiers and business names, exact files changed, confirmation of template preservation, build/test results, unverified data, and any owner decisions required.

Begin with the repository audit. Do not edit implementation files until the template and the mapping for all 24 separate business sites are confirmed.


## 7. Publicly researched business data
The archive now includes a `public_research` object for every business in `data/services.json` and each individual `profile.json`. It contains public services, verified direct business URLs when found, price status, explicitly sourced price items, source URLs, and discrepancy notes.

Use these rules:
- Keep owner-provided fields intact; use `public_research` as a separate evidence layer.
- Only use `public_website_url` as the business website when it is a direct business page. Do not present directory pages or Google Maps search links as official websites.
- Do not display third-party price estimates as official prices. Where the source is third-party, label the price and date/source context or omit it from customer-facing UI until confirmed.
- If `price_status` says no reliable business-specific price list was found, show a neutral Russian message such as “Стоимость уточняйте по телефону” rather than inventing prices.
- Review `reports/PUBLIC_DATA_ENRICHMENT_REPORT_EN.md` before publishing; it records conflicts that must not be silently resolved.
