import profile from '../../../services/service_05/profile.json';
import { buildSite } from '@autoservice/shared/lib/model';
import type { RawProfile } from '@autoservice/shared/lib/types';
import type { NavItem } from '@autoservice/shared/components/SiteHeader.astro';
import { content } from './content';

export const site = buildSite(profile as RawProfile, content);

export const nav: NavItem[] = [
  { href: '#services', label: 'Услуги' },
  { href: '#prices', label: 'Цены' },
  { href: '#about', label: 'О мастерской' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#request', label: 'Заявка' },
];

export const THEME_COLOR = '#0a1f3d';
