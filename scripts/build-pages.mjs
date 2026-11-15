// Builds all six sites into one folder for a single static host
// (e.g. a GitHub Pages project site): dist-pages/<site>/ plus an index page.
//
//   PAGES_ORIGIN  origin of the host, e.g. https://<owner>.github.io
//   PAGES_BASE    path prefix, e.g. /<repo>   (empty for a root deployment)
//   PUBLIC_PREVIEW=1 (default here) keeps the demo out of search engines.
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const origin = process.env.PAGES_ORIGIN || '';
const prefix = (process.env.PAGES_BASE || '').replace(/\/$/, '');
const out = `${root}/dist-pages`;
const sites = readdirSync(`${root}/sites`)
  .filter((name) => /^service_\d\d$/.test(name))
  .sort();

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const items = [];
for (const id of sites) {
  console.log(`\n=== pages build: ${id} ===`);
  const result = spawnSync('npm', ['run', 'build', '--workspace', `sites/${id}`], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      BASE_PATH: `${prefix}/${id}/`,
      ...(origin ? { SITE_URL: origin } : {}),
      PUBLIC_PREVIEW: process.env.PUBLIC_PREVIEW ?? '1',
    },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
  cpSync(`${root}/sites/${id}/dist`, `${out}/${id}`, { recursive: true });
  const profile = JSON.parse(readFileSync(`${root}/services/${id}/profile.json`, 'utf8'));
  items.push(`<li><a href="./${id}/">${profile.name.replace(/&/g, '&amp;')}</a> <small>${id}</small></li>`);
}

// Internal index (English, not customer-facing, never indexed).
writeFileSync(
  `${out}/index.html`,
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Six automotive service websites - preview index</title>
<style>
body{font:16px/1.6 system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1.25rem;background:#0e1013;color:#f2f4f7}
a{color:#ecc068;font-weight:600;font-size:1.25rem}li{margin:.75rem 0}small{color:#a3acb9;margin-left:.5rem}
p{color:#a3acb9}
</style>
</head>
<body>
<h1>Preview index</h1>
<p>Internal preview of six websites built from one shared design system. Forms run in demo mode; business data is subject to owner confirmation before launch.</p>
<ol>
${items.join('\n')}
</ol>
</body>
</html>
`,
);
writeFileSync(`${out}/robots.txt`, 'User-agent: *\nDisallow: /\n');
writeFileSync(`${out}/.nojekyll`, '');
console.log(`\nCombined build written to dist-pages/ (${sites.length} sites).`);
