// Source-data integrity checks (local files only; no network access).
// Fails when a per-site profile drifts from data/services.json, when the
// owner-provided fields are malformed, or when photo approvals are inconsistent.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => JSON.parse(readFileSync(`${root}/${path}`, 'utf8'));
const errors = [];
const data = read('data/services.json');
const plan = read('data/site-plan.json');

if (data.records.length !== 24) errors.push(`Expected 24 records, found ${data.records.length}`);
const ids = data.records.map((record) => record.id);
if (new Set(ids).size !== ids.length) errors.push('Duplicate record ids');

for (const record of data.records) {
  const dir = `services/${record.id}`;
  if (!existsSync(`${root}/${dir}/profile.json`)) {
    errors.push(`${record.id}: profile.json missing`);
    continue;
  }
  const { approved_photos: approved = [], ...rest } = read(`${dir}/profile.json`);
  if (!isDeepStrictEqual(rest, record))
    errors.push(`${record.id}: profile.json differs from data/services.json`);
  for (const key of ['id', 'business_name', 'address', 'phone']) {
    if (!record[key]) errors.push(`${record.id}: missing required field "${key}"`);
  }
  if (!Array.isArray(record.services_ru) || record.services_ru.length === 0)
    errors.push(`${record.id}: services_ru is empty`);
  for (const phone of record.phone.split(' / ')) {
    if (phone.replace(/\D/g, '').length !== 11) errors.push(`${record.id}: unexpected phone "${phone}"`);
  }
  const url = record.public_research?.public_website_url;
  if (url && !/^https:\/\//.test(url)) errors.push(`${record.id}: website URL is not https: ${url}`);
  if (url && /google\.com\/maps|2gis|spravker|rting|esbd|spravmer|driff/.test(url))
    errors.push(`${record.id}: a directory or map link is stored as the business website`);
  if (!plan[record.id]) errors.push(`${record.id}: not assigned to a template in data/site-plan.json`);

  const photoDir = `${root}/${dir}/photos`;
  const onDisk = existsSync(photoDir)
    ? readdirSync(photoDir).filter((name) => /\.(jpe?g|png|webp|avif)$/i.test(name))
    : [];
  const approvedFiles = approved.map((photo) => photo.file);
  for (const file of onDisk) {
    if (!approvedFiles.includes(file))
      errors.push(`${record.id}: photo ${file} is not listed in approved_photos`);
  }
  for (const photo of approved) {
    if (!onDisk.includes(photo.file))
      errors.push(`${record.id}: approved photo ${photo.file} is missing on disk`);
    if (!photo.alt_ru) errors.push(`${record.id}: approved photo ${photo.file} has no alt_ru`);
  }
  if (!existsSync(`${root}/sites/${record.id}`)) errors.push(`${record.id}: no site directory`);
}

const counts = Object.values(plan).reduce(
  (acc, entry) => ({ ...acc, [entry.direction]: (acc[entry.direction] ?? 0) + 1 }),
  {},
);
for (const [direction, count] of Object.entries(counts)) {
  if (count !== 4) errors.push(`template ${direction} is used by ${count} sites (expected 4)`);
}

if (errors.length > 0) {
  console.error(`validate-data: ${errors.length} problem(s)\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(
  'validate-data: OK (24 records, profiles match data/services.json, 6 templates x 4 sites, photo approvals consistent)',
);
