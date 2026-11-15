import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  buildSite,
  formatDateRu,
  parseHours,
  parsePrice,
  parseRating,
  pluralRu,
  ratingCountLabel,
} from '../../shared/lib/model.ts';

const data = JSON.parse(readFileSync(new URL('../../data/services.json', import.meta.url), 'utf8'));

test('parsePrice handles every format used in the data', () => {
  assert.equal(parsePrice('from RUB 3,000', 'x').display, 'от 3 000 ₽');
  assert.equal(parsePrice('RUB 20,000–30,000', 'x').display, '20 000–30 000 ₽');
  assert.equal(parsePrice('RUB 1,700', 'x').display, '1 700 ₽');
  assert.equal(parsePrice('from 12 000 ₽', 'x').display, 'от 12 000 ₽');
  assert.deepEqual(
    { kind: parsePrice('RUB 800–1,500', 'x').kind, min: 800, max: 1500 },
    { kind: 'range', min: parsePrice('RUB 800–1,500', 'x').min, max: parsePrice('RUB 800–1,500', 'x').max },
  );
});

test('parsePrice rejects unknown formats instead of guessing', () => {
  assert.throws(() => parsePrice('call us', 'x'));
  assert.throws(() => parsePrice('approx. RUB 5,000', 'x'));
  assert.throws(() => parsePrice('from RUB 1,000–2,000', 'x'));
});

test('every price in data/services.json parses', () => {
  let count = 0;
  for (const service of data.services) {
    for (const item of service.prices) {
      const row = parsePrice(item.price, item.service);
      assert.ok(row.min > 0, `${service.id}: ${item.price}`);
      count += 1;
    }
  }
  assert.equal(count, 57);
});

test('parseRating reads value and count, including a range', () => {
  assert.deepEqual(parseRating('5.0/5 (52 ratings; value shown)'), {
    value: '5,0',
    count: '52',
    countNumber: 52,
  });
  assert.equal(parseRating('4.9/5 (145–146 ratings; count varies)').count, '145–146');
  assert.equal(parseRating('unknown'), null);
  for (const service of data.services) assert.ok(parseRating(service.rating), service.id);
});

test('rating label pluralises in Russian', () => {
  assert.equal(ratingCountLabel(parseRating('5.0/5 (52 ratings)')), '52 оценки');
  assert.equal(ratingCountLabel(parseRating('5.0/5 (42 ratings)')), '42 оценки');
  assert.equal(ratingCountLabel(parseRating('5.0/5 (239 ratings)')), '239 оценок');
  assert.equal(ratingCountLabel(parseRating('4.8/5 (221 ratings)')), '221 оценка');
  assert.equal(ratingCountLabel(parseRating('4.9/5 (145–146 ratings)')), '145–146 оценок');
  assert.equal(pluralRu(11, ['a', 'b', 'c']), 'c');
});

test('opening hours are shown only for a complete schedule', () => {
  assert.equal(parseHours('Daily, 10:00–19:00 (according to the 2GIS listing)'), 'Ежедневно, 10:00–19:00');
  assert.equal(parseHours('The listing showed the business as closed and opening tomorrow at 10:00'), null);
  const withHours = data.services.filter((service) => parseHours(service.hours)).map((service) => service.id);
  assert.deepEqual(withHours, ['service_05']);
});

test('formatDateRu', () => {
  assert.equal(formatDateRu('2026-11-15'), '15 ноября 2026 г.');
});

test('buildSite refuses copy that does not align with the profile', () => {
  const profile = data.services[0];
  const base = {
    categoryRu: 'x',
    descriptionRu: 'x',
    addressRu: { street: 's', district: 'd', city: 'c', region: 'r', postalCode: '0' },
    serviceLabelsRu: ['a'],
    priceLabelsRu: ['a', 'b', 'c'],
  };
  assert.equal(buildSite(profile, base).prices.length, 3);
  assert.throws(() => buildSite(profile, { ...base, priceLabelsRu: ['a', 'b'] }));
  assert.throws(() => buildSite(profile, { ...base, serviceLabelsRu: ['a', 'invented'] }));
  assert.throws(() => buildSite(profile, { ...base, priceGroups: [{ titleRu: 'g', items: [0, 1] }] }));
  // A profile without a verified service list must not get invented services.
  const noServices = data.services[3];
  assert.throws(() => buildSite(noServices, { ...base, priceLabelsRu: [], serviceLabelsRu: ['Ремонт'] }));
  assert.deepEqual(buildSite(noServices, { ...base, priceLabelsRu: [], serviceLabelsRu: [] }).services, []);
});
