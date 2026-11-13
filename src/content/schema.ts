import { z } from "zod";

export const DEMO_NOTICE = "Demo concept, not an official website; we will remove it upon the first request.";
const status = z.enum(["confirmed", "unconfirmed", "missing", "unknown"]);
const iso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const priceItem = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.number().positive().nullable(),
  unit: z.string().nullable(),
  source: z.string().nullable(),
  checkedAt: iso.nullable(),
  // true → rendered as «от N ₽» (the source publishes a starting price).
  from: z.boolean().optional(),
});

export const siteSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    locale: z.string(),
    checkedAt: iso,
    verificationStatus: status,
    // Visual design per site: "atelier" (dark, An DesignStudio) or "card" (light, directory-card layout inspired by 2GIS patterns).
    design: z.enum(["atelier", "card"]).default("atelier"),
    theme: z.object({ accent: hex, accentHi: hex, accentDeep: hex }).optional(),
    // Optional visual skin on top of the «atelier» design (same structure; own palette, fonts, buttons, decoration). See src/skins/.
    skin: z.enum(["volt", "ion"]).optional(),
    // Page <title> / meta description (injected into index.html at build time by vite.config.ts). `index: true` allows search indexing.
    seo: z.object({ title: z.string().min(1), description: z.string().min(1), index: z.boolean().default(false) }).optional(),
    // Per-site overrides of shared UI strings (e.g. «сервис» instead of «студия»). The demo notice cannot be overridden.
    ui: z.record(z.any()).optional(),
    business: z.object({ name: z.string().min(1), city: z.string(), category: z.string(), timeZone: z.string().default("Asia/Vladivostok") }).passthrough(),
    hero: z.object({ eyebrow: z.string(), title: z.string(), subtitle: z.string(), image: z.string() }).passthrough(),
    intro: z.object({
      statement: z.string(), statementStatus: z.enum(["concept", "confirmed"]), body: z.string(), image: z.string(),
      facts: z.array(z.object({ label: z.string(), value: z.string(), status })),
    }),
    contacts: z.object({
      address: z.object({ display: z.string(), mapQuery: z.string(), status, source: z.string() }).passthrough(),
      phones: z.array(z.object({ display: z.string(), e164: z.string().regex(/^\+\d{10,15}$/), status, source: z.string() })).min(1),
      hours: z.object({ value: z.string().nullable(), status }),
      website: z.object({ url: z.string().url().nullable(), status }),
      social: z.array(z.object({ label: z.string(), url: z.string().url(), status })),
    }),
    servicesNote: z.string().optional(),
    services: z.array(z.object({
      id: z.string(), title: z.string(), image: z.string(), short: z.string(), details: z.string(),
      status: z.enum(["listed", "unverified", "confirmed"]), priceIds: z.array(z.string()),
    })),
    prices: z.array(z.object({ category: z.string(), items: z.array(priceItem) })),
    pricesNote: z.string().optional(),
    principles: z.object({ status: z.enum(["concept", "confirmed"]), items: z.array(z.object({ title: z.string(), text: z.string() })) }),
    // Only the studio's own, authorised photos. `permission` records who allowed it.
    portfolio: z.array(z.object({ src: z.string(), alt: z.string(), permission: z.string().min(1) })),
    // Only offers with confirmed terms and an end date.
    promotions: z.array(z.object({ title: z.string(), terms: z.string(), validUntil: iso, source: z.string() })),
    reviews: z.array(z.object({ text: z.string(), sourceUrl: z.string().url(), retrievedAt: iso })),
    // Every image needs alt text and a credit (licence source). Files live in public/sites/<slug>/img/<name>-{800,1600}.webp.
    images: z.record(z.object({ alt: z.string().min(1), credit: z.object({ label: z.string(), url: z.string().url(), license: z.string() }) })),
    sources: z.record(z.object({ label: z.string(), url: z.string().url(), note: z.string().optional() })),
    demo: z.object({ removalContact: z.string().nullable() }),
  })
  .passthrough()
  .superRefine((s, ctx) => {
    const ids = new Set(s.prices.flatMap((c) => c.items.map((i) => i.id)));
    for (const c of s.prices) for (const i of c.items) {
      if (i.amount !== null && (!i.source || !s.sources[i.source] || !i.checkedAt))
        ctx.addIssue({ code: "custom", message: `Price ${i.id} needs a known source and date` });
    }
    if (!s.images[s.hero.image]) ctx.addIssue({ code: "custom", message: `Unknown hero image ${s.hero.image}` });
    if (!s.images[s.intro.image]) ctx.addIssue({ code: "custom", message: `Unknown intro image ${s.intro.image}` });
    if (s.theme) {
      // atelier: accent text on the dark surface; card: accent text/buttons on white.
      const surface = s.design === "card" ? "#FFFFFF" : "#11151B";
      for (const k of (s.design === "card" ? ["accent", "accentDeep"] : ["accent", "accentHi"]) as ("accent" | "accentHi" | "accentDeep")[])
        if (contrast(s.theme[k], surface) < 4.5) ctx.addIssue({ code: "custom", message: `theme.${k} contrast < 4.5:1 on surface` });
    }
    for (const sv of s.services) {
      if (!s.images[sv.image]) ctx.addIssue({ code: "custom", message: `Unknown image ${sv.image}` });
      for (const p of sv.priceIds) if (!ids.has(p)) ctx.addIssue({ code: "custom", message: `Unknown price ${p}` });
      if (sv.status === "unverified" && sv.priceIds.length) ctx.addIssue({ code: "custom", message: `Unverified service ${sv.id} must not carry prices` });
    }
  });

/** WCAG contrast ratio between two #rrggbb colours. */
export function contrast(a: string, b: string) {
  const lum = (h: string) => {
    const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

export const uiSchema = z.object({ demoNotice: z.literal(DEMO_NOTICE) }).passthrough();

export type Site = z.infer<typeof siteSchema>;
export type UI = Record<string, any> & { demoNotice: string };

export const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
export const formatDate = (iso: string, locale: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
export const formatPrice = (i: { amount: number | null; from?: boolean }, fromLabel = "от") => (i.amount === null ? "" : `${i.from ? fromLabel + " " : ""}${formatRub(i.amount)}`);
export const formatRub = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
export const mapUrl = (q: string) => `https://yandex.ru/maps/?text=${encodeURIComponent(q)}`;
export const imgSrc = (slug: string, name: string, w: 800 | 1600) =>
  // Standalone review build: photos are embedded as data URIs in window.__IMG (see scripts/standalone.mjs).
  (globalThis as { __IMG?: Record<string, string> }).__IMG?.[`${name}-${w}`] ?? `${import.meta.env.BASE_URL}sites/${slug}/img/${name}-${w}.webp`;

/** Ordered list of sections that have something to show; drives numbering and navigation. */
export type SectionId = "about" | "services" | "prices" | "promotions" | "work" | "principles" | "contacts";
export function visibleSections(s: Site, today = new Date()): SectionId[] {
  const out: SectionId[] = ["about"];
  if (s.services.length) out.push("services");
  if (s.prices.some((c) => c.items.length)) out.push("prices");
  if (s.promotions.some((p) => new Date(p.validUntil + "T23:59:59Z") >= today)) out.push("promotions");
  out.push("work");
  if (s.principles.items.length) out.push("principles");
  out.push("contacts");
  return out;
}
export const sectionIndex = (ids: SectionId[], id: SectionId) => String(ids.indexOf(id) + 1).padStart(2, "0");
export const plural = (n: number, f: { one: string; few: string; many: string }) => {
  const m10 = n % 10, m100 = n % 100;
  return m10 === 1 && m100 !== 11 ? f.one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? f.few : f.many;
};
