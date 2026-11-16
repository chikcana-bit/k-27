import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for АвтоДиз (service_04).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Кузов, ходовая, шиномонтаж',
  descriptionRu:
    'АвтоДиз — кузов, ходовая, шиномонтаж в Артёме, ул. Дежнёва, 60А. Кузовной ремонт, ходовая, шиномонтаж. Адрес, телефон и заявка.',
  pageTitle: 'кузовной ремонт, ходовая и шиномонтаж в Артёме',
  heroTitle: 'Кузов,|ходовая|и шиномонтаж',
  heroLead: 'АвтоДиз — мастерская на ул. Дежнёва, 60А: кузовной ремонт, ремонт ходовой части и шиномонтаж.',
  aboutTitle: 'Три направления — один адрес',
  aboutText:
    'АвтоДиз работает в Артёме на ул. Дежнёва, 60А. По данным владельца, здесь выполняют кузовной ремонт, ремонт ходовой части и шиномонтаж. Стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
};
