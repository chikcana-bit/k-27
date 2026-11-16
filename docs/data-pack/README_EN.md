# Artem Automotive Services — 24-Site Data Update Pack

This package contains English-language prompts and structured owner-provided data for updating 24 existing, separate automotive-service websites in Artem, Primorsky Krai, Russia.

**Important:** This is a data-only update. It does not authorize creating new websites or changing the existing design/template.

## Contents
- `PROMPT_FOR_CLAUDE_CODE_EN.md` — master implementation prompt.
- `data/services.json` and `data/services.csv` — master data.
- `services/service_01/` through `services/service_24/` — individual profiles and focused prompts.
- `reports/DATA_AUDIT_EN.md` — initial data-quality notes.

## Use
Open the existing website repository in Claude Code, place these files into the workspace without overwriting unrelated files, and follow the master prompt. Claude Code must audit the repository and confirm that all 24 existing site instances are present before changing any data.

Customer-facing business names and content remain in Russian. Documentation and file structure are in English.


## Public data enrichment
See `reports/PUBLIC_DATA_ENRICHMENT_REPORT_EN.md` for researched public services, available prices, direct business links, source references, and unresolved discrepancies. Each service profile contains a separate `public_research` object.
