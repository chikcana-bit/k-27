# Design Variations

The six designs of the Komsomolsk set were converted into templates. The concept of each — page
composition, hero motif, typeface, geometry, motion language — is unchanged. What varies per site:

1. **Colour variant** — accent, background and surface tones (and, per template, the light source,
   material swatches, ink or trace colour). Set in `sites/<id>/src/styles/variant.css`.
2. **Layout variant** — on 12 sites the hero composition is mirrored (art/drawing/readout on the
   other side; the Signal poster aligned right). `MIRROR` in `sites/<id>/src/site.ts`.
3. **Content** — headline, lead, section titles and the services list per business.

Template choice follows each business's owner-provided services. All text/background pairs used
for text meet WCAG AA (4.5:1); checked with a script over every variant.

| Template | Typeface | Hero motif | Used for |
| --- | --- | --- | --- |
| Shade | Unbounded | Light through three tinted panes | Car washes |
| Orbit | Tektur | 360° dial | Multi-service centres with an official site |
| Atelier | Cormorant Garamond (light theme) | Stitched material swatches | Body, paint, detailing |
| Signal | Oswald (light theme) | Typographic poster, hazard stripes | General repair, little data |
| Blueprint | JetBrains Mono | Self-drawing technical drawing | Mechanical repair |
| Pulse | Russo One | Diagnostic trace | Electrics and diagnostics |

| Site | Business | Template | Variant | Accent | Background | Mirrored |
| --- | --- | --- | --- | --- | --- | --- |
| service_01 | Автоцентр Хадо | Signal | Signal · red | template default | #f3f1ec | no |
| service_02 | Автохит | Pulse | Pulse · yellow | template default | template default | no |
| service_03 | АвтоЛига | Atelier | Atelier · oxblood | #8e2626 | #f6efe9 | no |
| service_04 | АвтоДиз | Atelier | Atelier · forest | #2e5e3e | #f1f0e8 | yes |
| service_05 | СТО Стандарт | Orbit | Orbit · blue | #7fb0ff | #090c14 | no |
| service_06 | Art Master | Atelier | Atelier · ink blue | #2c4a8a | #f3f1ec | no |
| service_07 | АвтоЛют | Pulse | Pulse · electric blue | #3fb0ff | #0e1014 | yes |
| service_08 | Автодом | Pulse | Pulse · green | #3ee08a | #0f1110 | no |
| service_09 | Mobil-Артем | Blueprint | Blueprint · orange | template default | #0b1e3a | no |
| service_10 | Омега-Сервис | Signal | Signal · cobalt | #1f4fd1 | #eff1f4 | yes |
| service_11 | Сатурн | Signal | Signal · orange | #b84300 | #f4f1ec | no |
| service_12 | АвтоМаксимум | Blueprint | Blueprint · cyan | #3fd3e6 | #071a2a | yes |
| service_13 | СТО VISTA | Signal | Signal · green | #0d7a42 | #eef1ec | yes |
| service_14 | Кракен | Atelier | Atelier · sea teal | #1d5d66 | #eef2f0 | yes |
| service_15 | Пилот | Shade | Shade · mint | #6fe3c8 | #090d0c | no |
| service_16 | Автомойка / CarShine | Shade | Shade · sky | #8db8ff | #0a0c12 | yes |
| service_17 | Автомойка | Shade | Shade · amber | #ffc46b | #0d0b09 | no |
| service_18 | Мой Сам | Shade | Shade · coral | #ff9b85 | #0c0a0b | yes |
| service_19 | АвтоМир Приморье | Orbit | Orbit · sea green | #5fe0b0 | #070f0d | yes |
| service_20 | Авторитет-Авто+ | Orbit | Orbit · amber | #ffb067 | #100c09 | no |
| service_21 | Гиперавто | Orbit | Orbit · violet | template default | #0c0b13 | yes |
| service_22 | Автосервис | Blueprint | Blueprint · green sheet | #ffc247 | #0b2420 | no |
| service_23 | Totachi | Blueprint | Blueprint · graphite | #ff6a57 | #14171c | yes |
| service_24 | Автосервис | Pulse | Pulse · orange | #ff8a2a | #121110 | yes |
