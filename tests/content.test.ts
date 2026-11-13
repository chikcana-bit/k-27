// Generic checks for EVERY site in content/ (the template's contract). Business-specific facts live in site.test.tsx.
import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { siteSchema, uiSchema, visibleSections, DEMO_NOTICE } from "../src/content/schema";

const slugs = readdirSync("content").filter((f) => f.endsWith(".json") && !f.startsWith("_") && !f.startsWith("ui.")).map((f) => f.replace(".json", ""));

describe.each(slugs)("site %s", (slug) => {
  const raw = JSON.parse(readFileSync(`content/${slug}.json`, "utf8"));
  const parsed = siteSchema.safeParse(raw);
  const site = (parsed.success ? parsed.data : raw) as ReturnType<typeof siteSchema.parse>;
  it("has no unfilled template placeholders", () => expect(JSON.stringify(raw)).not.toMatch(/__/));
  it("validates against the schema", () => expect(parsed.success ? "" : parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n")).toBe(""));
  it("slug matches file name", () => expect(site.slug).toBe(slug));
  it("every service links to an existing price row (priceIds[0] or <id>-q)", () => {
    const ids = new Set(site.prices.flatMap((c: any) => c.items.map((i: any) => i.id)));
    const missing = site.services.map((s: any) => s.priceIds[0] ?? `${s.id}-q`).filter((id: string) => !ids.has(id));
    expect(missing).toEqual([]);
  });
  it("UI strings exist for its locale and carry the exact notice", () => {
    const ui = uiSchema.parse(JSON.parse(readFileSync(`content/ui.${site.locale}.json`, "utf8")));
    expect(ui.demoNotice).toBe(DEMO_NOTICE);
  });
  it("every referenced image exists in both sizes", () => {
    for (const name of Object.keys(site.images))
      for (const w of [800, 1600]) expect(existsSync(`public/sites/${slug}/img/${name}-${w}.webp`), `${name}-${w}`).toBe(true);
  });
  it.runIf(parsed.success)("contacts and work sections are always present", () => {
    const ids = visibleSections(site);
    expect(ids[0]).toBe("about"); expect(ids).toContain("work"); expect(ids.at(-1)).toBe("contacts");
  });
});

describe("template", () => {
  it("_template.json fails validation until filled (placeholders present)", () => {
    expect(readFileSync("content/_template.json", "utf8")).toMatch(/__/);
  });
});
