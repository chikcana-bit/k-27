# Data Changelog

Every site is new (`sites/service_XX`, published at `artem/service_XX/`). The table lists which
profile fields each site displays and how. Values are shown exactly as supplied unless noted.

Common to all 24 sites:

- `business_name`, `address`, `phone` — displayed verbatim; phones are `tel:` links.
- `services_ru` — displayed in full; first letter capitalised for display only.
- City «Артём» and region «Приморский край» from the record's `city`/`region` (English in the pack, Russian on the site).
- Prices: none displayed; neutral «Стоимость уточняйте по телефону».
- Hours: «Уточняйте по телефону» unless stated on the business's own website.
- «Адрес на карте» — Yandex Maps text search for «Артём, <address>»; no coordinates.
- `website_url` is null for all records; `public_research.public_website_url` is linked where present.
- `public_research.price_items` (Пилот, АвтоЛют third-party estimates) — not displayed.

| Site | Business (as displayed) | Template / variant | Phone(s) | Extra fields used | Notes |
| --- | --- | --- | --- | --- | --- |
| service_01 | Автоцентр Хадо | Signal · red | +7 902 485-84-55 | — |  |
| service_02 | Автохит | Pulse · yellow | +7 924 120-33-44 | — | Extra directory phone not added. |
| service_03 | АвтоЛига | Atelier · oxblood | +7 902 555-07-97 | — | Merged duplicate entry; specific address used. |
| service_04 | АвтоДиз | Atelier · forest (mirrored hero) | +7 914 725-79-07 | — |  |
| service_05 | СТО Стандарт | Orbit · blue | +7 423 377-57-77 / +7 902 077-57-77 | website, 12 website services, hours 09:00–21:00, e-mail (all from the official page) |  |
| service_06 | Art Master | Atelier · ink blue | +7 423 257-50-27 | — | Directory lists Фрунзе, 45 — owner address kept. |
| service_07 | АвтоЛют | Pulse · electric blue (mirrored hero) | +7 902 556-98-72 | — | Directory adds «стр. 2» — owner address kept. |
| service_08 | Автодом | Pulse · green | +7 423 202-52-00 | — |  |
| service_09 | Mobil-Артем | Blueprint · orange | +7 423 299-99-58 | — | Expanded directory services not added. |
| service_10 | Омега-Сервис | Signal · cobalt (mirrored hero) | +7 423 250-63-33 | — |  |
| service_11 | Сатурн | Signal · orange | +7 42337 4-30-37 | — | Phone format preserved, flagged. |
| service_12 | АвтоМаксимум | Blueprint · cyan (mirrored hero) | +7 924 322-08-06 | — | «Auto-Maks» alternate name not used. |
| service_13 | СТО VISTA | Signal · green (mirrored hero) | +7 908 993-61-18 | — | Directory lists 30А — owner 30 kept. |
| service_14 | Кракен | Atelier · sea teal (mirrored hero) | +7 914 668-10-41 | — | Neighbouring tyre service not merged. |
| service_15 | Пилот | Shade · mint | +7 984 192-05-52 | — |  |
| service_16 | Автомойка / CarShine | Shade · sky (mirrored hero) | +7 423 373-70-50 | — | Name kept as «Автомойка / CarShine». |
| service_17 | Автомойка | Shade · amber | +7 902 520-38-38 | — | Generic name kept. |
| service_18 | Мой Сам | Shade · coral (mirrored hero) | +7 914 971-78-50 | — | Directory phone differs (masked) — owner phone kept. |
| service_19 | АвтоМир Приморье | Orbit · sea green (mirrored hero) | +7 423 279-01-09 | website, 7 website services («warranty support» omitted: unverifiable claim wording) | Website shows +7 423 279-00-70 — owner phone kept. |
| service_20 | Авторитет-Авто+ | Orbit · amber | +7 423 279-09-19 | website, 3 website services (detailing from a listing omitted) | Official page shows +7 423 279-09-79 — owner phone kept. |
| service_21 | Гиперавто | Orbit · violet (mirrored hero) | 8 800 555-23-88 | website, 4 website services (branch page) | Owner hotline shown; branch numbers not added. |
| service_22 | Автосервис | Blueprint · green sheet | +7 423 274-17-48 | — | Displayed as «Автосервис» (placeholder name). |
| service_23 | Totachi | Blueprint · graphite (mirrored hero) | +7 423 256-74-70 | — | Totachi shown as the name; identity unconfirmed. |
| service_24 | Автосервис | Pulse · orange (mirrored hero) | +7 914 330-81-68 | — | Displayed as «Автосервис» (placeholder name). |
