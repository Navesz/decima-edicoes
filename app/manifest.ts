import type { MetadataRoute } from 'next';
import { assetPath } from './lib/base-path';
import { siteDescription, siteName } from './lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: assetPath('/'),
    name: siteName,
    short_name: 'DÉCIMA',
    description: siteDescription,
    start_url: assetPath('/'),
    scope: assetPath('/'),
    display: 'standalone',
    background_color: '#171411',
    theme_color: '#171411',
    lang: 'pt-BR',
    categories: ['design', 'lifestyle'],
    icons: [
      {
        src: assetPath('/icon.png'),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
