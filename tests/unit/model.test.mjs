import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  buildSite,
  capitalise,
  formatDateRu,
  mapSearchUrl,
  parsePhones,
  pluralRu,
} from '../../shared/lib/model.ts';

const data = JSON.parse(readFileSync(new URL('../../data/services.json', import.meta.url), 'utf8'));
const byId = Object.fromEntries(data.records.map((record) => [record.id, record]));
const content = {
  categoryRu: 'Автосервис',
  descriptionRu: 'x',
  pageTitle: 'x',
  heroTitle: 'x',
  heroLead: 'x',
  aboutTitle: 'x',
  aboutText: 'x',
  requestTitle: 'x',
  requestLead: 'x',
};

test('parsePhones keeps the owner text and builds tel: values', () => {
  assert.deepEqual(parsePhones('+7 902 485-84-55'), [{ display: '+7 902 485-84-55', href: '+79024858455' }]);
  assert.deepEqual(parsePhones('8 800 555-23-88'), [{ display: '8 800 555-23-88', href: '88005552388' }]);
  assert.deepEqual(parsePhones('+7 42337 4-30-37'), [{ display: '+7 42337 4-30-37', href: '+74233743037' }]);
  assert.equal(parsePhones('+7 423 377-57-77 / +7 902 077-57-77').length, 2);
  assert.throws(() => parsePhones('+7 902 485'));
});

test('every record phone parses', () => {
  for (const record of data.records) assert.ok(parsePhones(record.phone).length >= 1, record.id);
});

test('buildSite keeps owner facts exactly', () => {
  const site = buildSite(byId.service_03, content);
  assert.equal(site.name, 'АвтоЛига');
  assert.equal(site.street, 'ул. Дежнёва, 60А, стр. 8');
  assert.deepEqual(site.services, ['Кузовной ремонт']);
  assert.equal(site.website, null);
});

test('placeholder names need a display name', () => {
  assert.throws(() => buildSite(byId.service_22, content));
  assert.equal(buildSite(byId.service_22, { ...content, displayName: 'Автосервис' }).name, 'Автосервис');
});

test('website comes only from a verified business page', () => {
  assert.equal(buildSite(byId.service_05, content).website, 'https://stostandart.iprim.ru/');
  assert.equal(buildSite(byId.service_01, content).website, null);
  assert.throws(() => buildSite(byId.service_01, { ...content, officialServicesRu: ['x'] }));
});

test('helpers', () => {
  assert.equal(capitalise('ходовая'), 'Ходовая');
  assert.equal(pluralRu(1, ['a', 'b', 'c']), 'a');
  assert.equal(pluralRu(3, ['a', 'b', 'c']), 'b');
  assert.equal(pluralRu(12, ['a', 'b', 'c']), 'c');
  assert.equal(formatDateRu('2026-11-16'), '16 ноября 2026 г.');
  assert.ok(mapSearchUrl('Артём', 'ул. Кирова, 120').startsWith('https://yandex.ru/maps/?text='));
});
