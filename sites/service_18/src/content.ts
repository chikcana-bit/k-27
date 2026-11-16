import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Мой Сам (service_18).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Мойка самообслуживания',
  descriptionRu:
    'Мой Сам — мойка самообслуживания в Артёме, ул. Кирова, 57Б. Автомойка самообслуживания. Адрес, телефон и заявка.',
  pageTitle: 'автомойка самообслуживания в Артёме',
  heroTitle: 'Автомойка самообслуживания',
  heroLead: 'Мой Сам — на ул. Кирова, 57Б в Артёме. Подробности — по телефону.',
  aboutTitle: 'Мой Сам на Кирова',
  aboutText:
    'Мой Сам — автомойка самообслуживания в Артёме, ул. Кирова, 57Б. Режим работы и стоимость уточняйте по телефону.',
  requestTitle: 'Есть вопрос?',
  requestLead: 'Напишите, что хотите уточнить. Ответ даст сервис.',
  tags: ['Сам'],
};
