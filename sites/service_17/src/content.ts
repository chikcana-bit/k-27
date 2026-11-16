import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Автомойка (service_17).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автомойка',
  descriptionRu: 'Автомойка — автомойка в Артёме, ул. Кирова, 165. Мойка. Адрес, телефон и заявка.',
  pageTitle: 'автомойка в Артёме',
  heroTitle: 'Мойка автомобилей на Кирова',
  heroLead: 'Автомойка на ул. Кирова, 165 в Артёме. Стоимость и свободное время — по телефону.',
  aboutTitle: 'Автомойка на Кирова',
  aboutText:
    'Автомойка в Артёме по адресу ул. Кирова, 165. Стоимость и свободное время уточняйте по телефону.',
  requestTitle: 'Запишитесь на мойку',
  requestLead: 'Укажите автомобиль и удобное время. Стоимость и свободное время сообщит сервис.',
  tags: ['Мойка'],
};
