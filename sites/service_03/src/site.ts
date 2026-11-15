import profile from '../../../services/service_03/profile.json';
import { buildSite } from '@autoservice/shared/lib/model';
import type { RawProfile } from '@autoservice/shared/lib/types';
import type { NavItem } from '@autoservice/shared/components/SiteHeader.astro';
import { content } from './content';

export const site = buildSite(profile as RawProfile, content);

export const nav: NavItem[] = [
  { href: '#about', label: 'Ателье' },
  { href: '#services', label: 'Услуги' },
  { href: '#prices', label: 'Цены' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#request', label: 'Заявка' },
];

export const THEME_COLOR = '#f6f0e4';
