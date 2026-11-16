import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Автоцентр Хадо (service_01).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис и запчасти',
  descriptionRu:
    'Автоцентр Хадо — автосервис и запчасти в Артёме, ул. Дзержинского, 11А. Автосервис, запчасти. Адрес, телефон и заявка.',
  pageTitle: 'автосервис и запчасти в Артёме',
  heroTitle: 'Автоцентр|Хадо',
  heroLead: 'Ремонт автомобилей и запчасти — на ул. Дзержинского, 11А. Запись и стоимость — по телефону.',
  aboutTitle: 'Автоцентр на Дзержинского',
  aboutText:
    'Автоцентр Хадо — автосервис в Артёме. Здесь занимаются ремонтом автомобилей и работают с запчастями. Подробности и стоимость работ уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
};
