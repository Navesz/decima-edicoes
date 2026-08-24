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
    dir: 'ltr',
    categories: ['design', 'lifestyle'],
    shortcuts: [
      {
        name: 'Ver coleções DÉCIMA',
        short_name: 'Coleções',
        description: 'Abrir o arquivo de edições e estudos da DÉCIMA.',
        url: assetPath('/colecoes/'),
      },
      {
        name: 'Abrir o Caderno do Atelier',
        short_name: 'Caderno',
        description: 'Consultar decisões, protótipos e critérios de produção.',
        url: assetPath('/caderno/'),
      },
    ],
    icons: [
      {
        src: assetPath(brand.assets.icon),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: assetPath(brand.assets.maskableIcon),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
