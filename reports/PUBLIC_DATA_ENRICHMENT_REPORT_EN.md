# Public Data Enrichment Report

Research location: Artem, Primorsky Krai, Russia
Research date: 2026-11-16
Scope: 24 unique business records in the supplied archive.

## Data handling rules
- Original owner-provided fields (phone, address, business name, and service list) are preserved.
- Publicly researched information is stored separately under `public_research` in each profile and master JSON record.
- A public listing is not automatically treated as an official business website.
- A price is included only when a public source explicitly displayed a price for the matching business. Third-party prices are labeled as such and require confirmation.
- Conflicting phones, addresses, and names are not silently substituted.
- Empty website fields mean that no reliable exact URL was confirmed during this research pass; they do not prove that no website exists.

## Price findings
- Pilot: third-party directory lists complex wash from 350 RUB and R14 tire replacement from 800 RUB. Treat as unverified/outdated until confirmed.
- AvtoLyut: a secondary listing gives an estimated labor-hour range of 1,000–2,000 RUB. This is not an official tariff and is marked low confidence.
- No reliable business-specific public price list was found for the remaining businesses in the reviewed sources.
- Do not display generic citywide average prices as if they were a service's own prices.

## Important discrepancies requiring confirmation
1. Art Master: owner-provided address is Orbita microdistrict 38/2; a local directory lists Frunze Street 45.
2. AvtoLyut: local directories append building 2 to Voroshilova Street 23.
3. Vista: a directory lists Sevastopolskaya Street 30A, while the owner supplied 30.
4. AvtoMir Primorye: company page shows +7 423 279-00-70; owner supplied +7 423 279-01-09.
5. Avtoritet-Auto+: official page shows +7 423 279-09-79; owner supplied +7 423 279-09-19.
6. Hyperauto: official branch page lists store +7 (42337) 4-20-20 and service +7 (423) 202-89-02; owner supplied the general hotline 8 800 555-23-88.
7. Avtohit: local directory also lists +7 908 977-33-44.
8. Moy Sam: public directory phone is masked and does not confirm owner-supplied +7 914 971-78-50.
9. Totachi: a directory additionally lists +7 902 556-74-70 and lspk@rambler.ru.
10. Saturn: public directory confirms the unusual local-number formatting as +7 (42337) 4-30-37.
11. AutoMaximum: a directory uses the similar name “Auto-Maks”; identity match is not confirmed.
12. Kraken: one source lists Kraken at Frunze 41 building 1, while a nearby tire service is at building 2. Do not merge.
13. CarShine: public listing matches Lazo 38/2 and the supplied phone, but no official price page was found.

## Public source register
- https://stostandart.iprim.ru/
- https://iprim.ru/store/стенд-развал-схождение-в-Артеме/
- https://hyperauto.ru/
- https://hyperauto.ru/artem/address-map/g-artem-ul-frunze-12-1/
- https://avtoritet-auto.ru/about/contact/
- https://automir-primore.clients.site/
- https://rting.ru/artem/avtoservisy
- https://artem.spravker.ru/diagnostika-dvigatelia/
- https://artem.spravker.ru/tekhnicheskoe-obsluzhivanie-avtomobilia/
- https://artem.spravker.ru/avtoservisy-gaz/
- https://artem.spravker.ru/zamena-amortizatorov/
- https://artem.spravker.ru/avtoservis-koreiskikh-avtomobilei/
- https://artem.spravker.ru/avtomoiki/
- https://artem.spravker.ru/ruchnye-avtomoiki/
- https://artem.spravka.city/company/galleya
- https://urbanplaces.su/ru_primorskij-kraj/artyomovskij-gorodskoj-okrug-artem/address-kirova-57b
- https://primorskiy.spravochnika.ru/c-artem/avtomoyki
- https://artem.esbd.ru/autoservice
- https://artyom.spravmer.ru/avtomobili/
- https://artyom.spravmer.ru/avtomobili/avtoservis-uslugi/avtoservis-avtotehcentr/
- https://driff.ru/service/sto/artem/ulica-frunze-st/
- https://www.google.com/maps/search/?api=1&query=Автоцентр+Хадо+Артём+ул.+Дзержинского+11А
- https://www.google.com/maps/search/?api=1&query=Центр+кузовного+ремонта+АвтоЛига+Артём
- https://www.google.com/maps/search/?api=1&query=CarShine+Артём+ул.+Лазо+38%2F2
- https://www.google.com/maps/search/?api=1&query=Totachi+автосервис+Артём+Кирова+153

## Website integration guidance
Use `public_website_url` only when a direct business page was found. Put directory and map links in `source_urls` as research references, not as official website links. Keep all customer-facing text in Russian, consistent with the existing project prompt.
