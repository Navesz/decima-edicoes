import { edition } from './project';
import { brand } from './brand';

export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://navesz.github.io/decima-edicoes'
).replace(/\/$/, '');

export const siteName = brand.name;
export const siteDescription = `Mesas autorais em madeira e aço, produzidas em coleções de apenas ${edition.runSizeWord} peças numeradas.`;

export function absoluteUrl(path = '/') {
  if (path === '/') return `${siteOrigin}/`;
  return `${siteOrigin}${path.startsWith('/') ? path : `/${path}`}`;
}
