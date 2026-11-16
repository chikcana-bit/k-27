import type { Phone, RawProfile, SiteContent, SiteModel } from './types';

/** Date of the data pack's public research pass (reports/PUBLIC_DATA_ENRICHMENT_REPORT_EN.md). */
export const SOURCE_CHECKED_ON = '2026-11-16';

const NBSP = ' ';

export function pluralRu(count: number, forms: [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export function formatDateRu(iso: string): string {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) throw new Error(`Bad ISO date: ${iso}`);
  return `${day}${NBSP}${months[month - 1]} ${year}${NBSP}г.`;
}

/**
 * Splits the owner-provided phone field ("+7 423 377-57-77 / +7 902 077-57-77")
 * and builds tel: values. The displayed text is never reformatted.
 */
export function parsePhones(raw: string): Phone[] {
  return raw
    .split(' / ')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((display) => {
      const digits = display.replace(/\D/g, '');
      if (digits.length !== 11) throw new Error(`Unexpected phone length: "${display}"`);
      if (display.startsWith('+7')) return { display, href: `+${digits}` };
      if (display.startsWith('8')) return { display, href: digits };
      throw new Error(`Unexpected phone prefix: "${display}"`);
    });
}

/** Capitalises only the first letter for display ("ходовая" -> "Ходовая"). */
export function capitalise(text: string): string {
  return text.charAt(0).toLocaleUpperCase('ru-RU') + text.slice(1);
}

/** Search link for a map service. Not a business page and not a coordinate. */
export function mapSearchUrl(city: string, street: string): string {
  return `https://yandex.ru/maps/?text=${encodeURIComponent(`${city}, ${street}`)}`;
}

export function buildSite(profile: RawProfile, content: SiteContent): SiteModel {
  if (/без указанного бренда/i.test(profile.business_name) && !content.displayName) {
    throw new Error(`${profile.id}: placeholder name needs content.displayName`);
  }
  if (content.officialServicesRu?.length && !profile.public_research.public_website_url) {
    throw new Error(`${profile.id}: officialServicesRu requires a verified business website`);
  }
  const city = 'Артём';
  return {
    id: profile.id,
    name: content.displayName ?? profile.business_name,
    ownerName: profile.business_name,
    content,
    city,
    region: 'Приморский край',
    street: profile.address,
    addressLine: `${profile.address}, ${city}`,
    phones: parsePhones(profile.phone),
    services: profile.services_ru.map(capitalise),
    website: profile.website_url ?? profile.public_research.public_website_url,
    mapUrl: mapSearchUrl(city, profile.address),
    checkedOn: SOURCE_CHECKED_ON,
    photos: profile.approved_photos ?? [],
  };
}
