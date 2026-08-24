import type { MetadataRoute } from 'next';
import { absoluteUrl } from './lib/site';

export const dynamic = 'force-static';

const routes = [
  { path: '/', priority: 1, changeFrequency: 'monthly' as const },
  { path: '/colecoes/', priority: .8, changeFrequency: 'monthly' as const },
  { path: '/colecoes/nordica-yggdrasil/', priority: .9, changeFrequency: 'monthly' as const },
  { path: '/caderno/', priority: .7, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date('2026-08-24T00:00:00-03:00'),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
