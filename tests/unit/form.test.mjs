import assert from 'node:assert/strict';
import { test } from 'node:test';
import { composeLeadText, validateLead } from '../../shared/motion/form.ts';

const valid = { name: 'Анна', contact: '+7 900 000-00-00', service: '', message: '', consent: true };

test('valid lead passes', () => {
  assert.deepEqual(validateLead(valid), {});
  assert.deepEqual(validateLead({ ...valid, contact: 'anna@example.com' }), {});
  assert.deepEqual(validateLead({ ...valid, contact: '@anna_k' }), {});
});

test('required fields and formats are enforced', () => {
  const errors = validateLead({ name: ' ', contact: '', service: '', message: '', consent: false });
  assert.deepEqual(Object.keys(errors).sort(), ['consent', 'contact', 'name']);
  assert.ok(validateLead({ ...valid, contact: '12345' }).contact);
  assert.ok(validateLead({ ...valid, contact: 'not a contact' }).contact);
  assert.ok(validateLead({ ...valid, message: 'x'.repeat(1001) }).message);
});

test('composeLeadText includes only what the visitor entered', () => {
  const text = composeLeadText({ ...valid, service: 'Тонировка', message: ' Toyota ' }, 'ProSTO');
  assert.equal(
    text,
    'Заявка для «ProSTO»\nИмя: Анна\nКонтакт: +7 900 000-00-00\nУслуга: Тонировка\nКомментарий: Toyota',
  );
  assert.ok(!composeLeadText(valid, 'ProSTO').includes('Услуга'));
});
