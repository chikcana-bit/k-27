import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Гиперавто (service_21).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис и автозапчасти',
  descriptionRu:
    'Гиперавто — автосервис и автозапчасти в Артёме, ул. Фрунзе, 12/1. Автосервис, запчасти, диагностика. Адрес, телефон и заявка.',
  pageTitle: 'автосервис, запчасти и диагностика в Артёме',
  heroTitle: 'Автосервис, запчасти и диагностика',
  heroLead: 'Гиперавто на ул. Фрунзе, 12/1 в Артёме: автосервис, запчасти и диагностика.',
  aboutTitle: 'Гиперавто на Фрунзе',
  aboutText:
    'Гиперавто в Артёме находится на ул. Фрунзе, 12/1. По данным владельца, здесь работают автосервис, продажа запчастей и диагностика. Перечень работ филиала опубликован на сайте компании.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
  officialServicesRu: ['Магазин автозапчастей', 'Автосервис', 'Автоэлектрика и диагностика', 'Шиномонтаж'],
};
