import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Сатурн (service_11).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис',
  descriptionRu: 'Сатурн — автосервис в Артёме, ул. Кирова, 152А. Автосервис. Адрес, телефон и заявка.',
  pageTitle: 'автосервис в Артёме',
  heroTitle: 'Автосервис|Сатурн',
  heroLead: 'Автосервис на ул. Кирова, 152А. Запись и стоимость — по телефону.',
  aboutTitle: 'Автосервис на Кирова',
  aboutText:
    'Сатурн — автосервис в Артёме. На этой странице собраны адрес и телефон. Перечень работ, стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
};
