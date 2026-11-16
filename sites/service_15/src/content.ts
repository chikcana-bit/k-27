import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Пилот (service_15).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автомойка',
  descriptionRu:
    'Пилот — автомойка в Артёме, ул. Фрунзе, 21А, стр. 2. Автомойка, автосервисный бокс. Адрес, телефон и заявка.',
  pageTitle: 'автомойка и автосервисный бокс в Артёме',
  heroTitle: 'Автомойка и автосервисный бокс',
  heroLead: 'Пилот — на ул. Фрунзе, 21А, стр. 2 в Артёме. Стоимость и свободное время — по телефону.',
  aboutTitle: 'Пилот на Фрунзе',
  aboutText:
    'Пилот — автомойка в Артёме, где также есть автосервисный бокс. Перечень работ, стоимость и свободное время уточняйте по телефону.',
  requestTitle: 'Запишитесь на мойку',
  requestLead: 'Укажите автомобиль и удобное время. Стоимость и свободное время сообщит сервис.',
  tags: ['Пилот'],
};
