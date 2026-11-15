/** Raw record as stored in `services/service_XX/profile.json` (single source of truth). */
export interface ApprovedPhoto {
  /** File name inside `services/service_XX/photos/`. */
  file: string;
  /** Russian alt text describing what is actually in the photograph. */
  alt_ru: string;
  /** Where the photo may be used. */
  usage?: 'hero' | 'gallery' | 'services' | 'workshop';
}

export interface RawPrice {
  service: string;
  price: string;
}

export interface RawProfile {
  id: string;
  name: string;
  category: string;
  address: string;
  rating: string;
  phone: string;
  messengers: string[];
  email: string | null;
  hours: string;
  services: string[];
  prices: RawPrice[];
  price_count: number | null;
  photo_count: number;
  '2gis': string;
  price_url: string;
  gallery_url: string;
  verified_notes: string;
  /** Added by the project owner once photo permission is obtained. */
  approved_photos?: ApprovedPhoto[];
}

/** Russian customer-facing copy for one site. Facts must mirror the profile. */
export interface SiteContent {
  /** Russian category label (translation of `profile.category`). */
  categoryRu: string;
  /** Short neutral description used for meta description and intro. */
  descriptionRu: string;
  /** Russian address parts (translation of `profile.address`). */
  addressRu: {
    street: string;
    district: string;
    city: string;
    region: string;
    postalCode: string;
  };
  /**
   * Russian service names, index-aligned with `profile.services`.
   * Leave empty when the profile has no verified service list.
   */
  serviceLabelsRu: string[];
  /** Russian price-item names, index-aligned with `profile.prices`. */
  priceLabelsRu: string[];
  /** Optional grouping of price rows (indexes into `profile.prices`). */
  priceGroups?: { titleRu: string; items: number[] }[];
  /**
   * Date the source price list was last updated, as recorded in the local
   * source notes (ISO date). Omit when the source does not state it.
   */
  priceUpdated?: string;
  /** Number of price items in the full source list when only a selection is stored. */
  priceListTotal?: number;
}

export type PriceKind = 'from' | 'range' | 'fixed';

export interface PriceRow {
  labelRu: string;
  kind: PriceKind;
  min: number;
  max: number | null;
  /** Formatted Russian price string, e.g. "от 3 000 ₽". */
  display: string;
}

export interface Rating {
  /** e.g. "5,0" */
  value: string;
  /** e.g. "52" or "145–146" */
  count: string;
  /** Numeric lower bound of the count, used for pluralisation. */
  countNumber: number;
}

export interface SiteModel {
  id: string;
  /** Official business name exactly as in the source listing. */
  name: string;
  content: SiteContent;
  addressLine: string;
  services: string[];
  prices: PriceRow[];
  priceGroups: { titleRu: string; rows: PriceRow[] }[];
  rating: Rating | null;
  /** Russian opening hours, or null when the full schedule is not verified. */
  hoursRu: string | null;
  messengers: string[];
  email: string | null;
  links: { profile: string; prices: string; gallery: string };
  /** ISO date when the source listing was checked. */
  checkedOn: string;
  photos: ApprovedPhoto[];
}
