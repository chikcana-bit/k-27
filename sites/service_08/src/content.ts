import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Автодом (service_08).
 * Name, address, phone and services are read from the profile at build time;
 * this file holds wording only and must not add facts.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис и мойка',
  descriptionRu:
    'Автодом — автосервис и мойка в Артёме, ул. Западная, 5. Автосервис, мойка, диагностика. Адрес, телефон и заявка.',
  pageTitle: 'автосервис, мойка и диагностика в Артёме',
  heroTitle: 'Автосервис, мойка и диагностика',
  heroLead: 'Автодом — автосервис на ул. Западной, 5: ремонт, мойка и диагностика автомобилей.',
  aboutTitle: 'Автодом на Западной',
  aboutText:
    'Автодом — автосервис в Артёме по адресу ул. Западная, 5. По данным владельца, здесь работают автосервис, мойка и диагностика. Стоимость и время визита уточняйте по телефону.',
  requestTitle: 'Опишите задачу',
  requestLead: 'Укажите автомобиль и что нужно сделать. Стоимость и время визита сообщит сервис.',
  tags: ['автосервис', 'мойка', 'диагностика'],
};
