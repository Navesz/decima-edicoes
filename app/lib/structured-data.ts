import { absoluteUrl, siteDescription, siteName } from './site';
import { brand } from './brand';

export const brandId = absoluteUrl('/#brand');
export const websiteId = absoluteUrl('/#website');

export const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Brand',
      '@id': brandId,
      name: siteName,
      description: siteDescription,
      url: absoluteUrl('/'),
      logo: absoluteUrl(brand.assets.logoDark),
      slogan: brand.slogan,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: siteName,
      description: siteDescription,
      url: absoluteUrl('/'),
      inLanguage: brand.locale,
      about: { '@id': brandId },
    },
  ],
};

type Breadcrumb = { name: string; url: string };

export function breadcrumbSchema(pageUrl: string, items: Breadcrumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type WebPageSchemaOptions = {
  type?: 'WebPage' | 'CollectionPage';
  url: string;
  name: string;
  description: string;
  mainEntityId?: string;
  version?: string;
  dateModified?: string;
};

export function webPageSchema({ type = 'WebPage', url, name, description, mainEntityId, version, dateModified }: WebPageSchemaOptions) {
  return {
    '@type': type,
    '@id': `${url}#page`,
    url,
    name,
    description,
    inLanguage: brand.locale,
    isPartOf: { '@id': websiteId },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
    ...(version ? { version } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}
