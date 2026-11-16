import profile from '../../../services/service_05/profile.json';
import { buildSite } from '@autoservice/shared/lib/model';
import type { RawProfile } from '@autoservice/shared/lib/types';
import type { NavItem } from '@autoservice/shared/components/SiteHeader.astro';
import { content } from './content';

export const site = buildSite(profile as RawProfile, content);

/** Template and layout variant (see reports/DESIGN_VARIATIONS.md). */
export const TEMPLATE = 'orbit';
export const MIRROR = false;

export const nav: NavItem[] = [
  { href: '#services', label: 'Услуги' },
  { href: '#prices', label: 'Стоимость' },
  { href: '#about', label: 'О сервисе' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#request', label: 'Заявка' },
];

export const THEME_COLOR = '#090c14';
