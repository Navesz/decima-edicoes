import type { MetadataRoute } from 'next';
import { assetPath } from './lib/base-path';
import { brand } from './lib/brand';
import { siteDescription, siteName } from './lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: assetPath('/'),
    name: siteName,
    short_name: brand.shortName,
    description: siteDescription,
    start_url: assetPath('/'),
    scope: assetPath('/'),
    display: 'standalone',
    background_color: brand.palette.ink.hex,
    theme_color: brand.palette.ink.hex,
    lang: brand.locale,
    categories: ['design', 'lifestyle'],
    icons: [
      {
        src: assetPath(brand.assets.icon),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
