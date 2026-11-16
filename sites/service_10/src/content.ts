import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Омега-Сервис (service_10).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис',
  descriptionRu:
    'Омега-Сервис — автосервис в Артёме, ул. Фрунзе, 45, корп. 2. Автосервис. Адрес, телефон и заявка.',
  pageTitle: 'автосервис в Артёме',
  heroTitle: 'Омега-|Сервис',
  heroLead: 'Автосервис на ул. Фрунзе, 45, корп. 2. Запись и стоимость — по телефону.',
  aboutTitle: 'Автосервис на Фрунзе',
  aboutText:
    'Омега-Сервис — автосервис в Артёме. На этой странице собраны адрес и телефон. Перечень работ, стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
};
