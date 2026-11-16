import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Автосервис (без указанного бренда) (service_24).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  displayName: 'Автосервис',
  categoryRu: 'Автосервис',
  descriptionRu:
    'Автосервис — автосервис в Артёме, ул. Первомайская, 15. Ремонт, ТО, автоэлектрика. Адрес, телефон и заявка.',
  pageTitle: 'ремонт, ТО и автоэлектрика в Артёме',
  heroTitle: 'Ремонт, ТО и автоэлектрика',
  heroLead: 'Автосервис на ул. Первомайской, 15 в Артёме: ремонт, техническое обслуживание и автоэлектрика.',
  aboutTitle: 'Автосервис на Первомайской',
  aboutText:
    'Автосервис в Артёме по адресу ул. Первомайская, 15. По данным владельца, здесь выполняют ремонт, техническое обслуживание и работы по автоэлектрике. Стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
  tags: ['ремонт', 'ТО', 'автоэлектрика'],
};
