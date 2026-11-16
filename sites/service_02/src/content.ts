import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Автохит (service_02).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис',
  descriptionRu:
    'Автохит — автосервис в Артёме, ул. Кирова, 120. Ремонт, ТО, диагностика, автоэлектрика. Адрес, телефон и заявка.',
  pageTitle: 'ремонт, ТО и диагностика в Артёме',
  heroTitle: 'Ремонт, ТО, диагностика и автоэлектрика',
  heroLead:
    'Автохит — автосервис на ул. Кирова, 120: ремонт, техническое обслуживание, диагностика и автоэлектрика.',
  aboutTitle: 'Автохит на Кирова',
  aboutText:
    'Автохит — автосервис в Артёме. По данным владельца, здесь выполняют ремонт, техническое обслуживание, диагностику и работы по автоэлектрике. Стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Запишитесь на диагностику',
  requestLead: 'Укажите автомобиль и что беспокоит. Время визита и стоимость сообщит сервис.',
  tags: ['диагностика', 'ТО', 'автоэлектрика'],
};
