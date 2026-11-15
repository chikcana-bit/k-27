import type { SiteContent } from '@autoservice/shared/lib/types';

/**
 * Russian customer-facing copy for ZigZag.
 * Every fact mirrors services/service_06/profile.json; amounts and rating are
 * derived from the profile at build time and are not retyped here.
 */
export const content: SiteContent = {
  categoryRu: 'Автосервис',
  descriptionRu:
    'ZigZag — автосервис в Комсомольске-на-Амуре: диагностика подвески, комплексная и компьютерная диагностика. Адрес, цены на диагностику и заявка.',
  addressRu: {
    street: 'Аллея Труда, 8/3Г',
    district: 'Центральный округ',
    city: 'Комсомольск-на-Амуре',
    region: 'Хабаровский край',
    postalCode: '681000',
  },
  serviceLabelsRu: [
    'Диагностика подвески',
    'Комплексная диагностика подвески, двигателя и технических жидкостей',
    'Компьютерная диагностика электронных систем',
    'Установка охранных систем Pandora и StarLine (по описанию в карточке компании)',
  ],
  priceLabelsRu: [
    'Диагностика подвески',
    'Комплексная диагностика (подвеска / двигатель / технические жидкости)',
    'Компьютерная диагностика (экспресс)',
    'Компьютерная диагностика (полная)',
  ],
  priceUpdated: '2026-03-09',
};
