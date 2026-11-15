// Runs an npm script in every site workspace (or one: `npm run build -- service_03`).
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [script, ...only] = process.argv.slice(2);
if (!script) {
  console.error('Usage: node scripts/run.mjs <dev|build|check> [site ...]');
  process.exit(1);
}
const all = readdirSync(`${root}/sites`)
  .filter((name) => /^service_\d\d$/.test(name))
  .sort();
const targets = only.length > 0 ? only : all;
if (script === 'dev' && targets.length !== 1) {
  console.error(`Pick one site for dev, e.g.: npm run dev -- ${all[0]}`);
  process.exit(1);
}
for (const site of targets) {
  console.log(`\n=== ${script}: ${site} ===`);
  const result = spawnSync('npm', ['run', script, '--workspace', `sites/${site}`], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
