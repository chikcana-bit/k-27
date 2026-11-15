import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for DetailTeamServis.
 * Every fact mirrors services/service_01/profile.json; amounts, rating and
 * hours are derived from the profile at build time and are not retyped here.
 */
export const content: SiteContent = {
  categoryRu: 'Автодетейлинг',
  descriptionRu:
    'DetailTeamServis — автодетейлинг в Комсомольске-на-Амуре. Тонировка автомобильных стёкол: лобового, заднего, боковых и форточек. Адрес, цены и заявка.',
  addressRu: {
    street: 'ул. Базовая, 5В',
    district: 'Центральный округ',
    city: 'Комсомольск-на-Амуре',
    region: 'Хабаровский край',
    postalCode: '681000',
  },
  serviceLabelsRu: ['Тонировка автомобильных стёкол'],
  priceLabelsRu: ['Тонировка лобового / заднего стекла', 'Тонировка форточки', 'Тонировка бокового стекла'],
};
