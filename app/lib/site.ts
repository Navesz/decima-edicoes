export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://navesz.github.io/decima-edicoes'
).replace(/\/$/, '');

export const siteName = 'DÉCIMA Edições';
export const siteDescription = 'Mesas autorais em madeira e aço, produzidas em coleções de apenas dez peças numeradas.';

export function absoluteUrl(path = '/') {
  if (path === '/') return `${siteOrigin}/`;
  return `${siteOrigin}${path.startsWith('/') ? path : `/${path}`}`;
}
