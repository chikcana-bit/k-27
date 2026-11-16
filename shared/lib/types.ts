/** Raw record as stored in `services/service_XX/profile.json` (single source of truth). */
export interface ApprovedPhoto {
  /** File name inside `services/service_XX/photos/`. */
  file: string;
  /** Russian alt text describing what is actually in the photograph. */
  alt_ru: string;
  /** Where the photo may be used. */
  usage?: 'hero' | 'gallery' | 'services' | 'workshop';
}

export interface PublicPriceItem {
  item: string;
  price: string;
  price_type: string;
  confidence?: string;
}

/** Evidence layer added by public research. Never overrides owner-provided fields. */
export interface PublicResearch {
  research_status: string;
  /** Direct business page, when one was found. Directory and map links are not websites. */
  public_website_url: string | null;
  public_services: string[];
  price_status: string;
  price_items: PublicPriceItem[];
  source_urls: string[];
  notes: string[];
}

export interface RawProfile {
  id: string;
  /** Owner-provided name, kept exactly. */
  business_name: string;
  business_name_transliteration: string;
  city: string;
  region: string;
  country: string;
  /** Owner-provided street address, kept exactly. */
  address: string;
  /** Owner-provided phone(s), kept exactly; several numbers are separated by " / ". */
  phone: string;
  services_ru: string[];
  services_en: string[];
  /** Exact website URL supplied by the owner (none so far). */
  website_url: string | null;
  website_status: string;
  data_source: string;
  verification_status: string;
  public_research: PublicResearch;
  /** Added by the project owner once photo permission is obtained. */
  approved_photos?: ApprovedPhoto[];
}

/** Russian customer-facing copy for one site. Facts must mirror the profile. */
export interface SiteContent {
  /**
   * Name shown in the header and titles. Defaults to the owner-provided name;
   * set only when that name is a placeholder such as "Автосервис (без указанного бренда)".
   */
  displayName?: string;
  /** Russian category label, derived from the owner-provided service list. */
  categoryRu: string;
  /** Short neutral description used for meta description. */
  descriptionRu: string;
  /** Page-title suffix, e.g. "автомойка в Артёме". */
  pageTitle: string;
  heroTitle: string;
  heroLead: string;
  aboutTitle: string;
  aboutText: string;
  requestTitle: string;
  requestLead: string;
  /**
   * Services listed on the business's own website (public_research), translated.
   * Shown separately from the owner list and labelled with their source.
   */
  officialServicesRu?: string[];
  /** Opening hours stated on the business's own website. */
  officialHoursRu?: string;
  /** E-mail stated on the business's own website. */
  officialEmail?: string;
  /** Short words for decorative labels (Pulse trace ticks, Atelier tag, etc.). */
  tags?: string[];
}

export interface Phone {
  /** Exactly as supplied by the owner. */
  display: string;
  /** Value for a tel: link (digits only, with + for +7 numbers). */
  href: string;
}

export interface SiteModel {
  id: string;
  /** Name shown to visitors (owner-provided name unless it is a placeholder). */
  name: string;
  /** Owner-provided name exactly as supplied. */
  ownerName: string;
  content: SiteContent;
  city: string;
  region: string;
  /** Owner-provided street address exactly as supplied. */
  street: string;
  addressLine: string;
  phones: Phone[];
  /** Owner-provided services, first letter capitalised for display. */
  services: string[];
  /** Direct business website (owner-supplied, else verified public page), or null. */
  website: string | null;
  /** Map search for the address (not a business website, no coordinates). */
  mapUrl: string;
  /** ISO date of the data pack / public research pass. */
  checkedOn: string;
  photos: ApprovedPhoto[];
}
