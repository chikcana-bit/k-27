import type { PriceRow, Rating, RawProfile, SiteContent, SiteModel } from './types';

/** Date on which the local source records were checked (see data/services.json). */
export const SOURCE_CHECKED_ON = '2026-11-15';

const NBSP = ' ';

export function formatNumberRu(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

function toNumber(text: string): number {
  const digits = text.replace(/[^\d]/g, '');
  if (!digits) throw new Error(`No digits in price fragment "${text}"`);
  return Number(digits);
}

/**
 * Parses the price strings used in the local data:
 *   "from RUB 3,000" | "RUB 20,000–30,000" | "RUB 1,700" | "from 12 000 ₽"
 * Amounts are never retyped by hand: the site copy only supplies the label.
 */
export function parsePrice(raw: string, labelRu: string): PriceRow {
  const text = raw.trim();
  const isFrom = /^from\b/i.test(text);
  const body = text
    .replace(/^from\b/i, '')
    .replace(/RUB|₽/g, '')
    .trim();
  const parts = body.split(/[–-]/).map((part) => part.trim());
  if (parts.length > 2 || !/^[\d\s,. ]+$/.test(parts.join(''))) {
    throw new Error(`Unrecognised price format: "${raw}"`);
  }
  const min = toNumber(parts[0] ?? '');
  const max = parts.length === 2 ? toNumber(parts[1] ?? '') : null;
  if (isFrom && max !== null) throw new Error(`Ambiguous price: "${raw}"`);
  if (isFrom) {
    return { labelRu, kind: 'from', min, max: null, display: `от${NBSP}${formatNumberRu(min)}${NBSP}₽` };
  }
  if (max !== null) {
    return {
      labelRu,
      kind: 'range',
      min,
      max,
      display: `${formatNumberRu(min)}–${formatNumberRu(max)}${NBSP}₽`,
    };
  }
  return { labelRu, kind: 'fixed', min, max: null, display: `${formatNumberRu(min)}${NBSP}₽` };
}

/** "5.0/5 (52 ratings; …)" -> { value: "5,0", count: "52" } */
export function parseRating(raw: string): Rating | null {
  const match = /^(\d\.\d)\/5 \((\d+(?:–\d+)?) ratings/.exec(raw);
  if (!match || !match[1] || !match[2]) return null;
  return {
    value: match[1].replace('.', ','),
    count: match[2],
    countNumber: Number(match[2].split('–')[0]),
  };
}

/** Only a complete, explicitly stated schedule is shown to customers. */
export function parseHours(raw: string): string | null {
  const match = /^Daily, (\d{2}:\d{2})–(\d{2}:\d{2})/.exec(raw);
  if (!match) return null;
  return `Ежедневно, ${match[1]}–${match[2]}`;
}

export function pluralRu(count: number, forms: [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

/** "52 оценки", "145–146 оценок" (a range always takes the genitive plural). */
export function ratingCountLabel(rating: Rating): string {
  const word = rating.count.includes('–')
    ? 'оценок'
    : pluralRu(rating.countNumber, ['оценка', 'оценки', 'оценок']);
  return `${rating.count}${NBSP}${word}`;
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

/** A profile "service" entry that is only a note about missing data is not a service. */
function isRealServiceList(profile: RawProfile): boolean {
  return !profile.services.some((entry) => /not available/i.test(entry));
}

export function buildSite(profile: RawProfile, content: SiteContent): SiteModel {
  const hasServices = isRealServiceList(profile);
  if (hasServices && content.serviceLabelsRu.length !== profile.services.length) {
    throw new Error(`${profile.id}: serviceLabelsRu must align with profile.services`);
  }
  if (!hasServices && content.serviceLabelsRu.length > 0) {
    throw new Error(`${profile.id}: profile has no verified services; serviceLabelsRu must be empty`);
  }
  if (content.priceLabelsRu.length !== profile.prices.length) {
    throw new Error(`${profile.id}: priceLabelsRu must align with profile.prices`);
  }
  const prices = profile.prices.map((item, index) =>
    parsePrice(item.price, content.priceLabelsRu[index] ?? ''),
  );
  const priceGroups = (content.priceGroups ?? []).map((group) => ({
    titleRu: group.titleRu,
    rows: group.items.map((index) => {
      const row = prices[index];
      if (!row) throw new Error(`${profile.id}: price group index ${index} out of range`);
      return row;
    }),
  }));
  if (priceGroups.length > 0) {
    const used = (content.priceGroups ?? []).flatMap((group) => group.items);
    if (used.length !== prices.length || new Set(used).size !== prices.length) {
      throw new Error(`${profile.id}: priceGroups must cover every price exactly once`);
    }
  }
  const a = content.addressRu;
  return {
    id: profile.id,
    name: profile.name,
    content,
    addressLine: `${a.street}, ${a.city}`,
    services: hasServices ? content.serviceLabelsRu : [],
    prices,
    priceGroups,
    rating: parseRating(profile.rating),
    hoursRu: parseHours(profile.hours),
    messengers: profile.messengers,
    email: profile.email,
    links: { profile: profile['2gis'], prices: profile.price_url, gallery: profile.gallery_url },
    checkedOn: SOURCE_CHECKED_ON,
    photos: profile.approved_photos ?? [],
  };
}
