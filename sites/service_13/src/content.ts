import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for СТО VISTA (service_13).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис и шиномонтаж',
  descriptionRu:
    'СТО VISTA — автосервис и шиномонтаж в Артёме, ул. Севастопольская, 30. Автосервис, шиномонтаж, уход за авто. Адрес, телефон и заявка.',
  pageTitle: 'автосервис и шиномонтаж в Артёме',
  heroTitle: 'СТО|VISTA',
  heroLead: 'Автосервис, шиномонтаж и уход за автомобилем — на ул. Севастопольской, 30.',
  aboutTitle: 'СТО на Севастопольской',
  aboutText:
    'СТО VISTA — автосервис в Артёме. По данным владельца, здесь работают автосервис и шиномонтаж, а также занимаются уходом за автомобилем. Стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
};
