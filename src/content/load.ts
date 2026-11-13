import { siteSchema, uiSchema, type Site, type UI } from "./schema";

// Content is selected at build time: VITE_SITE=<slug> (default an-designstudio).
const sites = import.meta.glob(["../../content/*.json", "!../../content/_*.json"], { eager: true, import: "default" }) as Record<string, unknown>;

export function loadSite(slug: string): { site: Site; ui: UI } {
  const raw = sites[`../../content/${slug}.json`];
  if (!raw) throw new Error(`No content file content/${slug}.json`);
  const site = siteSchema.parse(raw);
  // Shared strings + the site's own overrides; the notice itself is re-validated after merging.
  const ui = uiSchema.parse({ ...(sites[`../../content/ui.${site.locale}.json`] as object), ...(site.ui ?? {}) }) as UI;
  return { site, ui };
}
