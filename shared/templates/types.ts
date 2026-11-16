import type { ImageMetadata } from 'astro';
import type { NavItem } from '../components/SiteHeader.astro';
import type { SiteModel } from '../lib/types';

/** Props every template's Home.astro and Privacy.astro accept. */
export interface TemplateProps {
  site: SiteModel;
  nav: NavItem[];
  /** Browser chrome colour (the variant's background). */
  themeColor: string;
  /** Layout variant: mirrors the hero composition. */
  mirror?: boolean;
  /** Approved photos, globbed by the site (import.meta.glob needs a literal path). */
  photoFiles?: Record<string, { default: ImageMetadata }>;
}

export type Direction = 'shade' | 'orbit' | 'atelier' | 'signal' | 'blueprint' | 'pulse';
