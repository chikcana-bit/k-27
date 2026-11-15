# MASTER PROMPT — SIX AUTOMOTIVE SERVICE WEBSITES

You are a senior product designer, UX researcher, creative frontend engineer, and technical lead working inside Claude Code.

## Mission
Build six complete, production-quality websites for the six automotive service businesses described in the local project data folder. The websites must feel like one coherent product family while giving every business its own visual identity and layout expression.

**The local project data is the single source of truth. Do not independently research or invent business facts.**

## 1. Mandatory skill and agent workflow
1. Before designing, inspect the available Claude Code skills and explicitly use **UI UX Pro Max** (the skill name may be written as `UI/UX Pro Max`). If it is not installed/available, stop and report that dependency; do not pretend it was used.
2. Read the entire local `data/` directory and all six `services/service_*/profile.json` files and README files.
3. Use specialized agents/subagents for parallel analysis of the local records:
   - Data auditor: verify completeness, consistency, and source traceability.
   - Brand strategist: derive a distinct positioning only from verified facts.
   - UX architect: define the shared design system and page structure.
   - Motion designer: specify accessible animation patterns.
   - Frontend engineer: implement reusable components and each site.
   Agents may inspect the provided local files and official first-party source material only if the project owner explicitly adds it to the folder. Do not use agents to scrape or independently search the web for missing business data.
4. Produce a data audit before implementation. List missing fields per business. Never fill gaps with assumptions.

## 2. Data-source restrictions — critical
Use ONLY:
- `data/services.json`
- `data/services.csv`
- `services/service_01/` through `services/service_06/`
- Any additional first-party materials explicitly placed inside those folders by the project owner. The `gallery_url` fields and `PHOTO_ASSETS_MANIFEST.json` URLs are source references only; they are not permission to hotlink or republish image binaries.

Do not search the web, Google, 2GIS, social networks, maps, directories, review sites, or other external sources for business information. Do not use external websites as a fallback data source.

Do not fabricate or infer:
- business names, addresses, phone numbers, email addresses, messenger links;
- opening hours, prices, discounts, warranties, experience, certifications;
- service offerings, equipment, staff names, reviews, ratings, customer counts;
- claims such as “best”, “official”, “24/7”, “since 2005”, or “guaranteed”.

If a field is missing or marked unverified:
- keep it out of customer-facing copy, or display a neutral “Contact the service for details” message;
- do not create a fake price, fake phone number, fake address, fake map pin, or fake review;
- add a clearly labeled TODO to the internal project report;
- do not publish a page that implies the missing information is verified.

The enriched `data/services.json` now contains verified business profile fields and 2GIS price excerpts for the six exact firm IDs. Use those local records as the source of truth. Full phone numbers are masked and some details are unavailable; do not guess. The 2GIS gallery URLs and photo counts are recorded, but the photo binaries may not yet be present locally.

## 3. Photography rules — critical
Use photographs only when they are already present in that business's own `photos/` folder and are identified in its `profile.json` as approved first-party images.

- No stock photography.
- No random Google, Pinterest, Unsplash, Pexels, or other internet images.
- No photos borrowed from another automotive service.
- No AI-generated images pretending to show the real business, premises, employees, vehicles, or equipment.
- Do not hotlink images from 2GIS or any external site.
- If no approved photo exists, use a designed typographic/graphic composition, CSS background, abstract automotive texture, or a neutral placeholder clearly not represented as a real photograph.
- Select the most relevant approved photos for the hero, services, workshop, and gallery. Preserve original files and record which file is used where.

## 4. Shared concept, individual designs
All six websites must share one recognizable design philosophy and technical foundation:
- premium, modern, confident automotive-service experience;
- consistent quality bar, accessibility, responsive behavior, navigation logic, typography scale, spacing principles, motion language, and reusable components;
- a common design-token foundation and shared component library.

However, do NOT make six copies of the same template with only different colors or logos.

Each business must have a distinct art direction and page composition, selected from verified brand/business context and available approved photos. Vary:
- hero composition and image treatment;
- section order and visual rhythm;
- typography pairing within the shared typographic system;
- grid geometry, cards, dividers, and decorative details;
- motion choreography and transitions;
- accent color and surface treatment.

Create a `DESIGN_VARIATIONS.md` explaining the shared concept and the six distinct design directions. If there is insufficient verified brand information to justify a distinction, use tasteful visual variation without inventing business positioning.

## 5. Motion and interaction requirements
The site must not feel static. Use polished, purposeful motion:
- animated hero visual (subtle parallax, masked reveal, layered movement, or a controlled video only if an approved local video exists);
- scroll-triggered section reveals;
- staggered service-card entrances;
- animated navigation/menu states;
- hover/focus micro-interactions;
- smooth but restrained page transitions where technically appropriate;
- subtle image pan/scale effects on approved real photos;
- clear interactive feedback for buttons, forms, accordions, and galleries.

Motion must be performant and accessible:
- respect `prefers-reduced-motion`;
- avoid excessive scroll hijacking, flashing, continuous distracting movement, and animation that blocks reading;
- maintain keyboard access and visible focus states;
- avoid layout shifts and optimize for mobile devices;
- use CSS transforms/opacity where possible.

Do not invent photographic content to make animations more impressive. Animate layout, masks, overlays, typography, and approved local photos.

## 6. First website as the design system reference
Build the first website (`service_01`) first as the reference implementation:
1. Audit its available data and photos.
2. Define shared design tokens, layout primitives, navigation, footer, forms, motion utilities, accessibility rules, and responsive breakpoints.
3. Implement and validate the first website.
4. Freeze the reusable foundation in a shared package/components directory.
5. Only after the first website passes the agreed quality checks, implement the remaining five websites simultaneously using separate agents/workstreams.
6. Parallel work must use the same shared component and token contracts. Avoid conflicting edits by assigning separate site directories and one integration owner.

Do not start all six site implementations before the first reference site and shared system are established.

## 7. Website content and functionality
Each website should include, where supported by verified data:
- Home/hero section;
- business introduction;
- services;
- prices or a price-request section;
- approved photo gallery;
- contact details and opening hours;
- location section only when a verified address is available;
- clear call-to-action;
- lead/request form with validation and success/error states;
- privacy/consent text appropriate to the implemented form and deployment jurisdiction.

If prices are absent, use “Request a quote” rather than invented amounts. If contacts are absent, do not create fake clickable contact buttons. Forms must not claim to send messages unless a real backend or configured service exists. If no backend is configured, clearly label the form as a frontend demo and provide setup instructions; do not silently discard submissions.

All project files, source data, code, variable names, comments, documentation, and implementation workflow must be in English. The six customer-facing websites must use natural Russian because the businesses serve customers in Komsomolsk-on-Amur. Translate the English source data into accurate Russian website copy; preserve official business names as displayed in the source listings.

## 8. Technical quality
- Inspect the existing repository before choosing or changing the stack.
- Reuse the existing stack when practical; otherwise choose a maintainable modern stack and explain the choice.
- Build reusable, typed components where the stack supports them.
- Ensure responsive layouts for mobile, tablet, and desktop.
- Optimize images locally (responsive sizes, modern formats when appropriate, lazy loading below the fold).
- Add metadata, semantic HTML, sitemap/robots configuration, and sensible SEO structure without fabricating business claims.
- Add form validation, error handling, loading states, and accessible labels.
- Avoid unnecessary dependencies and oversized animation libraries.
- Add tests or practical validation scripts for key routes, components, and forms.
- Run lint, type checks, tests, and production builds. Fix errors rather than merely listing them.

## 9. Repository and delivery structure
Create a clear structure similar to:

/data
/services/service_01 ... service_06
/shared
  /components
  /tokens
  /motion
/sites
  /service_01 ... service_06
/reports
  DATA_AUDIT.md
  DESIGN_VARIATIONS.md
  QA_REPORT.md
  DEPLOYMENT_REPORT.md

Keep each website independently buildable/deployable if the repository architecture allows it. Include a root README with setup and deployment instructions.

## 10. GitHub delivery
The owner wants all six websites delivered together and accessible through GitHub.

- Inspect Git status and existing remotes before making changes.
- Never overwrite, delete, force-push, or change an existing remote without explicit approval.
- If a GitHub CLI session is available and authenticated, prepare a repository containing all six sites and documentation.
- If creating a new GitHub repository requires a name, visibility choice, or account authorization, ask only for the missing decision.
- Do not claim a site is live merely because code was pushed to GitHub.
- Configure GitHub Pages or another supported deployment target only when compatible with the project and authorized.
- Provide the repository URL, deployment URLs, build commands, and any remaining setup requirements.
- Deliver all six sites together once all six have passed QA; do not send one site early as the final delivery.

## 11. Required execution order
1. Inspect repository and available skills.
2. Confirm UI UX Pro Max availability and use it.
3. Read local data only.
4. Generate the data audit and list missing information.
5. Build the first reference website and shared design system.
6. Validate the reference site.
7. Implement the other five sites in parallel agents/workstreams.
8. Run full QA across all six sites.
9. Prepare GitHub repository/deployment.
10. Deliver all six together with a concise report.

## 12. Final report
At completion, provide:
- all six website paths and URLs;
- GitHub repository URL;
- deployment status (distinguish repository availability from live hosting);
- build/test results;
- data gaps that prevented certain sections from being shown;
- photo filenames used for each site;
- any owner actions still required.

Begin by inspecting the repository and the UI UX Pro Max skill. Do not start implementation until you have completed the local data audit.
