import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for АвтоМир Приморье (service_19).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис и детейлинг',
  descriptionRu:
    'АвтоМир Приморье — автосервис и детейлинг в Артёме, ул. Махалина, 21. Сервис, детейлинг. Адрес, телефон и заявка.',
  pageTitle: 'автосервис и детейлинг в Артёме',
  heroTitle: 'Сервис и детейлинг на Махалина',
  heroLead: 'АвтоМир Приморье — сервис и детейлинг на ул. Махалина, 21 в Артёме.',
  aboutTitle: 'АвтоМир Приморье',
  aboutText:
    'АвтоМир Приморье находится в Артёме на ул. Махалина, 21. По данным владельца, здесь работают сервис и детейлинг. Более подробный перечень опубликован на сайте компании.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
  officialServicesRu: [
    'Продажа и обслуживание автомобилей',
    'Плановое обслуживание',
    'Запчасти и аксессуары',
    'Развал-схождение',
    'Шиномонтаж',
    'Вибродиагностика',
    'Детейлинг',
  ],
};
