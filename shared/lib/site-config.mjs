// Shared Astro configuration for every site in /sites.
// SITE_URL  - absolute production origin (enables sitemap + indexable robots.txt)
// BASE_PATH - sub-path when hosted under a prefix (e.g. GitHub Pages project site)
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

export function defineSiteConfig() {
  const site = process.env.SITE_URL || undefined;
  const base = process.env.BASE_PATH || '/';
  return defineConfig({
    site,
    base,
    trailingSlash: 'always',
    build: { format: 'directory', inlineStylesheets: 'auto' },
    devToolbar: { enabled: false },
    vite: {
      server: { fs: { allow: [repoRoot] } },
    },
  });
}
