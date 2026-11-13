import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { viteSingleFile } from "vite-plugin-singlefile";

// STANDALONE=1 → one self-contained index.html (JS, CSS, fonts inlined; photos injected by scripts/standalone.mjs) for offline review.
const standalone = !!process.env.STANDALONE;
// Per-site <title>, meta description and robots, taken from content/<slug>.json → seo (falls back to the template's defaults).
const siteMeta = () => ({
  name: "site-meta",
  transformIndexHtml(html: string) {
    const slug = process.env.VITE_SITE ?? "avtovatt";
    const seo = JSON.parse(readFileSync(`content/${slug}.json`, "utf8")).seo;
    if (!seo) return html;
    const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    return html
      .replace(/<title>.*?<\/title>/, `<title>${esc(seo.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(seo.description)}$2`)
      .replace(/(<meta name="robots" content=")[^"]*(")/, `$1${seo.index ? "index, follow" : "noindex, nofollow"}$2`);
  },
});
export default defineConfig({
  plugins: [react(), siteMeta(), ...(standalone ? [viteSingleFile()] : [])],
  // VITE_BASE="./" makes the build relocatable (GitHub Pages project sites are served from /<repo>/).
  ...(standalone ? { base: "./", publicDir: false } : process.env.VITE_BASE ? { base: process.env.VITE_BASE } : {}),
  test: { environment: "jsdom", include: ["tests/**/*.test.tsx", "tests/**/*.test.ts"], setupFiles: ["tests/setup.ts"] },
} as any);
