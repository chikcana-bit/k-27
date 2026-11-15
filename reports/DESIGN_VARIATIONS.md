# Design Variations

Design intelligence source: the **UI UX Pro Max** skill was loaded and queried
(`--design-system` for "automotive service detailing repair premium", plus `typography` and `ux`
domain searches). Its output set the family-level direction — premium dark-plus-warm-accent
foundation, scroll-triggered storytelling with a complete reading order without motion, staggered
list entrances, and the pre-delivery checklist (no emoji icons, 4.5:1 contrast, visible focus,
reduced motion, 375/768/1024/1440). Its "Liquid Glass" style suggestion is Apple-platform specific
and was used only as the translucency idea behind `service_01`.

## Shared concept: "Verified, well-made, in motion"

Every site is a single-page experience plus a privacy page. They share:

- **Foundation** — one token set (`shared/tokens/tokens.css`): fluid type scale, 4px spacing scale,
  radii, motion durations/easings, semantic colour roles, component knobs.
- **Typography system** — Manrope (Cyrillic, variable) for body and UI on all six sites; each site
  adds one display face for headings, numerals and brand. Same scale, same roles.
- **Components** — header with animated mobile menu and scroll-spy, section heading, service list,
  price list, quote panel, rating badge, contact panel, lead form, gallery, CTA band, footer.
- **Motion language** — word-by-word masked heading reveals, upward fade-in of content, staggered
  lists, slow parallax layers, fill-from-below button hover, a thin scroll-progress line, and
  cross-document view transitions between home and privacy. Everything is transform/opacity,
  one-shot, and collapses under `prefers-reduced-motion`.
- **Honesty rules** — the same treatment of facts everywhere: rating with its check date, prices
  with the "not a public offer" note, contacts routed to the business's own 2GIS listing, a demo
  label on the form.
- **No photography** — no approved first-party photos exist yet, so every hero is a designed
  typographic/graphic composition in CSS and inline SVG. A gallery section appears automatically
  once approved photos are added.

## Six directions

Distinctions are drawn from verified context only (business category, the services and prices in
each listing, the name). Where the data gives little to work with, the variation is purely visual
and no positioning is implied.

| | `service_01` DetailTeamServis | `service_02` 360 | `service_03` Luxury Styling & Detailing | `service_04` Avtomaks Mobile Center | `service_05` ProSTO | `service_06` ZigZag |
| --- | --- | --- | --- | --- | --- | --- |
| Direction | **Shade** | **Orbit** | **Atelier** | **Signal** | **Blueprint** | **Pulse** |
| Derived from | Listing shows window tinting only | The name; a studio working around the whole body (film, wrap, polish) | Interior reupholstery and trim work lead the price list | Category only (least data) | Mechanical repair price list; full opening hours | The name; diagnostics-led price list |
| Mode | Dark graphite | Dark, cool | **Light**, warm cream | **Light**, concrete grey | Dark blueprint navy | Dark asphalt |
| Accent | Ice cyan | Electric violet | Cognac leather | Signal red | Safety orange | Signal yellow |
| Display face | Unbounded | Tektur | Cormorant Garamond (serif) | Oswald (condensed caps) | JetBrains Mono | Russo One |
| Hero | Warm light source dimmed through three layered window silhouettes; highlight sweep | Giant "360" numerals inside concentric dial rings; arc draws itself | Asymmetric editorial heading beside stitched pattern-piece swatches | Typographic poster with hazard-stripe band and road-marking dashes | Self-drawing technical schematic with dimension lines | Self-drawing waveform / zigzag trace over a measurement grid |
| Geometry | Trapezoid panes, soft 18px cards | Circles, arcs, pills | Squared 2–6px, hairlines, dashed seams | Sharp 0–2px, strict ruled grid | Sharp, crop marks, call-out numbers | Chamfered corners, zigzag dividers |
| Section order | Hero → prices → about → contacts → form | Hero → services → grouped prices (accordion) → about → contacts → form | Hero → statement → services index → price ledger → contacts → form | Hero → facts strip → about → cost on request → contacts → form | Hero → title block/hours → services → spec table → about → contacts → form | Hero → price menu → services → about → contacts → form |
| Price treatment | Three "shade" cards, each one step lighter | Grouped accordions | Editorial ledger with leaders | None verified → quote panel | Grouped specification table with leaders | Four large cards |
| Signature motion | Parallax panes, light sweep on hover | Rings at different depths, arc sweep | Seam "sewing" itself on reveal | Line-by-line poster reveal, sliding stripe | Stroke drawing, extending dimension lines | Trace drawing, travelling scan marker |

### Notes per site

- **service_01 — Shade.** The only verified service is window tinting, so the whole identity is
  about light passing through glass. The three price items map to three pane shapes (windshield,
  quarter light, side glass).
- **service_02 — Orbit.** "360" is treated as a full turn around the car. Five verified service
  areas and fifteen prices are organised into groups so the long list stays scannable.
- **service_03 — Atelier.** The listing is led by reupholstery, so the site borrows from tailoring:
  serif type, paper tones, stitched seams. "Luxury" appears only inside the official name; no
  luxury claims are made in copy.
- **service_04 — Signal.** No service list and no prices are verified. The design carries the page
  through scale, rules and stripes instead of content, and says only what is known: category,
  address, rating, where to find contact details.
- **service_05 — Blueprint.** Mechanical work (engine, transmission, suspension, driveshaft) is
  presented like an engineering sheet. It is the only site that shows opening hours, because it is
  the only listing with a full schedule on record.
- **service_06 — Pulse.** The zigzag doubles as a diagnostic trace, matching a price list made
  entirely of diagnostics. The security-system installation is shown with its source qualifier.

## Why these are not one template in six colours

Each site has its own `Hero.astro`, its own `index.astro` composition and section order, its own
display typeface, corner geometry, divider language and price presentation, while importing the
same components and tokens. Two of the six are light themes. The shared layer guarantees that
navigation, forms, focus states, spacing rhythm and motion timing feel like one family.
