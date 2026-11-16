import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for АвтоЛют (service_07).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автоэлектрика',
  descriptionRu:
    'АвтоЛют — автоэлектрика в Артёме, ул. Ворошилова, 23. Автоэлектрика, диагностика. Адрес, телефон и заявка.',
  pageTitle: 'автоэлектрика и диагностика в Артёме',
  heroTitle: 'Автоэлектрика и диагностика',
  heroLead: 'АвтоЛют — автоэлектрика и диагностика на ул. Ворошилова, 23 в Артёме.',
  aboutTitle: 'АвтоЛют на Ворошилова',
  aboutText:
    'АвтоЛют — сервис автоэлектрики в Артёме. По данным владельца, здесь занимаются автоэлектрикой и диагностикой. Стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Запишитесь на диагностику',
  requestLead: 'Укажите автомобиль и что беспокоит. Время визита и стоимость сообщит сервис.',
  tags: ['автоэлектрика', 'диагностика', 'Артём'],
};
