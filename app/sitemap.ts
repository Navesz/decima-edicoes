import type { MetadataRoute } from 'next';
import { collection, documents } from './lib/project';
import { absoluteUrl } from './lib/site';

export const dynamic = 'force-static';

const routes = [
  { path: '/', priority: 1, changeFrequency: 'monthly' as const },
  { path: '/colecoes/', priority: .8, changeFrequency: 'monthly' as const },
  { path: `/colecoes/${collection.slug}/`, priority: .9, changeFrequency: 'monthly' as const },
  { path: '/caderno/', priority: .7, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(documents.updatedAtIso),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
