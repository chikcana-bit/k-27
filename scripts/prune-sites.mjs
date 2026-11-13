// After `build:site`, remove other businesses' assets from dist/<slug>/sites/ so each build ships only its own files.
import { readdirSync, rmSync } from "node:fs";
const slug = process.env.VITE_SITE ?? "avtovatt";
const dir = `dist/${slug}/sites`;
for (const d of readdirSync(dir)) if (d !== slug) rmSync(`${dir}/${d}`, { recursive: true, force: true });
console.log(`dist/${slug}: kept only sites/${slug}`);
