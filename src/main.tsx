import { createRoot } from "react-dom/client";
import { loadSite } from "./content/load";

const { site, ui } = loadSite(import.meta.env.VITE_SITE ?? "hybrid-center");
const html = document.documentElement;
html.lang = site.locale;
html.dataset.design = site.design;
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) html.classList.add("motion");
if (site.skin) html.dataset.skin = site.skin;
document.title = site.seo?.title ?? `${site.business.name} — демо-концепт`;
// Each design is a separate chunk, so a site downloads only its own components, CSS and fonts.
// VITE_DESIGN (set by scripts/standalone.mjs) fixes the design at build time so the unused design is dropped from the bundle.
const fixed = import.meta.env.VITE_DESIGN as string | undefined;
const load = fixed
  ? (fixed === "card" ? import("./designs/card") : import("./designs/atelier"))
  : (site.design === "card" ? import("./designs/card") : import("./designs/atelier"));
// A skin is a small extra chunk (palette, fonts, buttons, decoration) layered over the atelier design.
const skin = site.skin === "volt" ? import("./skins/volt") : site.skin === "ion" ? import("./skins/ion") : Promise.resolve();
Promise.all([load, skin]).then(([{ App }]) => createRoot(document.getElementById("root")!).render(<App site={site} ui={ui} />));
