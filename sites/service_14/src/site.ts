import profile from '../../../services/service_14/profile.json';
import { buildSite } from '@autoservice/shared/lib/model';
import type { RawProfile } from '@autoservice/shared/lib/types';
import type { NavItem } from '@autoservice/shared/components/SiteHeader.astro';
import { content } from './content';

export const site = buildSite(profile as RawProfile, content);

/** Template and layout variant (see reports/DESIGN_VARIATIONS.md). */
export const TEMPLATE = 'atelier';
export const MIRROR = true;

export const nav: NavItem[] = [
  { href: '#about', label: 'О мастерской' },
  { href: '#services', label: 'Услуги' },
  { href: '#prices', label: 'Стоимость' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#request', label: 'Заявка' },
];

export const THEME_COLOR = '#eef2f0';
