import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for Avtomaks Mobile Center.
 * The profile holds no verified service list and no prices, so both label
 * arrays stay empty; rating is derived from the profile at build time.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис',
  descriptionRu:
    'Avtomaks Mobile Center — автосервис в Комсомольске-на-Амуре: обслуживание и ремонт автомобилей. Адрес: ул. Вокзальная, 32/1. Контакты и заявка.',
  addressRu: {
    street: 'ул. Вокзальная, 32/1',
    district: 'Центральный округ',
    city: 'Комсомольск-на-Амуре',
    region: 'Хабаровский край',
    postalCode: '681000',
  },
  serviceLabelsRu: [],
  priceLabelsRu: [],
};
