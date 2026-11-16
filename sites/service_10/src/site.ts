import profile from '../../../services/service_10/profile.json';
import { buildSite } from '@autoservice/shared/lib/model';
import type { RawProfile } from '@autoservice/shared/lib/types';
import type { NavItem } from '@autoservice/shared/components/SiteHeader.astro';
import { content } from './content';

export const site = buildSite(profile as RawProfile, content);

/** Template and layout variant (see reports/DESIGN_VARIATIONS.md). */
export const TEMPLATE = 'signal';
export const MIRROR = true;

export const nav: NavItem[] = [
  { href: '#about', label: 'О сервисе' },
  { href: '#prices', label: 'Стоимость' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#request', label: 'Заявка' },
];

export const THEME_COLOR = '#eff1f4';
