# Pre-Update Audit

Date: 16 November 2026. Repository: `chikcana-bit/k-27`.

## What the repository contained

| Branch | Contents |
| --- | --- |
| `main` | GitHub Pages output: an owner review index (`index.html`), four single-file demo pages (`k27.html`, `an-designstudio.html`, `absolut-avto.html`, `pdr-autotechnology.html`), two built Vite sites (`avtovatt/`, `hybrid-center/`) and six built Astro sites `service_01/` … `service_06/`. |
| `source/autoservice-six` | Source of those six sites: an npm-workspaces Astro 7 monorepo with a shared design system (`shared/`) and six site packages, each with its own art direction (Shade, Orbit, Atelier, Signal, Blueprint, Pulse). |
| `source/avtovatt`, `source/hybrid-center`, `publish/autoservice-six` | Other owner projects / publishing branch. Not touched. |

## Mismatch with the data pack

The data pack's master prompt expects either 24 existing site instances for the Artem businesses or
one reusable template. The repository had neither:

- The existing `service_01` … `service_06` are **different businesses** (Komsomolsk-on-Amur:
  DetailTeamServis, 360, Luxury Styling & Detailing, Avtomaks Mobile Center, ProSTO, ZigZag).
  Overwriting them with Artem data would have destroyed the owner's published work.
- There were six designs, not one template.

## Decision (owner instruction)

The owner instructed: use the K27 repository's sites as templates, create new sites from them,
keep the concept and modify the design a bit. Therefore:

1. The six existing designs were turned into six reusable templates (`shared/templates/`), with
   hard-coded colours replaced by tokens so each instance can be re-coloured.
2. 24 new site instances were created, four per template, matched to the business type.
3. Each instance received its own colour variant; 12 of 24 also use a mirrored hero composition.
4. The Komsomolsk six were left untouched on `main` and on `source/autoservice-six`. The Artem sites
   are published under a separate path, `artem/service_XX/`, so no identifiers collide.
5. This work lives on a new branch, `source/artem-24`, created from `source/autoservice-six`.

## Data-model adaptation

The Komsomolsk sites read 2GIS-style records (rating, masked phone, price list, 2GIS links). The Artem
records have owner-provided name, address, phone(s) and services, plus a `public_research` layer.
`shared/lib/model.ts` and `types.ts` were rewritten for the new schema; components that only made
sense for the old data (`PriceList`, `RatingBadge`) were removed and replaced by `PriceNotice` and
`PhoneBadge`. Contacts now use `tel:` links to the owner's numbers and a map search link instead of
2GIS links.

## Git state before work

Clean clone; no local changes. No remotes changed, no force-push.
