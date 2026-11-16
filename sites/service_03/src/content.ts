import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for АвтоЛига (service_03).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Кузовной ремонт',
  descriptionRu:
    'АвтоЛига — кузовной ремонт в Артёме, ул. Дежнёва, 60А, стр. 8. Кузовной ремонт. Адрес, телефон и заявка.',
  pageTitle: 'кузовной ремонт в Артёме',
  heroTitle: 'Кузовной|ремонт|в Артёме',
  heroLead: 'АвтоЛига — кузовной ремонт на ул. Дежнёва, 60А, стр. 8. Стоимость и сроки — по телефону.',
  aboutTitle: 'Кузовной ремонт на Дежнёва',
  aboutText:
    'АвтоЛига — мастерская кузовного ремонта в Артёме. Адрес: ул. Дежнёва, 60А, стр. 8. Объём работ, стоимость и сроки уточняйте по телефону.',
  requestTitle: 'Расскажите о повреждении',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и сроки сообщит мастерская.',
  tags: ['Кузов'],
};
