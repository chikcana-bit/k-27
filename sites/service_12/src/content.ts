import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for АвтоМаксимум (service_12).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'ТО и ремонт',
  descriptionRu: 'АвтоМаксимум — то и ремонт в Артёме, ул. Фрунзе, 54А. ТО, ремонт. Адрес, телефон и заявка.',
  pageTitle: 'ТО и ремонт автомобилей в Артёме',
  heroTitle: 'ТО и ремонт автомобилей',
  heroLead: 'АвтоМаксимум — техническое обслуживание и ремонт на ул. Фрунзе, 54А в Артёме.',
  aboutTitle: 'АвтоМаксимум на Фрунзе',
  aboutText:
    'АвтоМаксимум — автосервис в Артёме. По данным владельца, здесь выполняют техническое обслуживание и ремонт автомобилей. Стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
};
