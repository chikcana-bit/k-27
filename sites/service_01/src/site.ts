import profile from '../../../services/service_01/profile.json';
import { buildSite } from '@autoservice/shared/lib/model';
import type { RawProfile } from '@autoservice/shared/lib/types';
import type { NavItem } from '@autoservice/shared/components/SiteHeader.astro';
import { content } from './content';

export const site = buildSite(profile as RawProfile, content);

export const nav: NavItem[] = [
  { href: '#prices', label: 'Услуги и цены' },
  { href: '#about', label: 'О сервисе' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#request', label: 'Заявка' },
];

export const THEME_COLOR = '#0a0c0f';
