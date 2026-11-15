// Source-data integrity checks (local files only; no network access).
// Fails when the per-site profile drifts from data/services.json or when a
// record gains fields that would require new customer-facing copy.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => JSON.parse(readFileSync(`${root}/${path}`, 'utf8'));
const errors = [];
const data = read('data/services.json');

if (data.services.length !== 6) errors.push(`Expected 6 services, found ${data.services.length}`);

for (const record of data.services) {
  const dir = `services/${record.id}`;
  const profile = read(`${dir}/profile.json`);
  const { approved_photos: approved = [], ...rest } = profile;
  if (!isDeepStrictEqual(rest, record))
    errors.push(`${record.id}: profile.json differs from data/services.json`);
  for (const key of ['id', 'name', 'category', 'address', '2gis', 'price_url', 'gallery_url']) {
    if (!record[key]) errors.push(`${record.id}: missing required field "${key}"`);
  }
  for (const url of [record['2gis'], record.price_url, record.gallery_url]) {
    if (!/^https:\/\/2gis\.ru\//.test(url)) errors.push(`${record.id}: unexpected source URL ${url}`);
  }
  // Photos: every file on disk must be approved in profile.json and vice versa.
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

if (errors.length > 0) {
  console.error(`validate-data: ${errors.length} problem(s)\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('validate-data: OK (6 records, profiles match data/services.json, photo approvals consistent)');
