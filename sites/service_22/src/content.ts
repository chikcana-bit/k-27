import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Автосервис (без указанного бренда) (service_22).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  displayName: 'Автосервис',
  categoryRu: 'Автосервис',
  descriptionRu:
    'Автосервис — автосервис в Артёме, ул. 2-я Пятилетка, 30А. Шиномонтаж, кузовной ремонт, ремонт двигателя. Адрес, телефон и заявка.',
  pageTitle: 'шиномонтаж, кузовной ремонт и ремонт двигателя в Артёме',
  heroTitle: 'Шиномонтаж, кузов, двигатель',
  heroLead: 'Автосервис на ул. 2-я Пятилетка, 30А в Артёме: шиномонтаж, кузовной ремонт и ремонт двигателя.',
  aboutTitle: 'Автосервис на 2-й Пятилетке',
  aboutText:
    'Автосервис в Артёме по адресу ул. 2-я Пятилетка, 30А. По данным владельца, здесь выполняют шиномонтаж, кузовной ремонт и ремонт двигателя. Стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
};
