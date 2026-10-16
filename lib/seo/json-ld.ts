import { COSMISOL_ADDRESSES } from '@/lib/site/addresses';

export const organizationJsonLd = (origin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${origin}/#organization`,
  name: 'Cosmisol Energy',
  url: origin,
  logo: `${origin}/images/logo.png`,
  email: 'contact@cosmisolenergy.com',
  telephone: '+91 73396 17710',
  location: COSMISOL_ADDRESSES.map(streetAddress => ({
    '@type': 'Place',
    address: { '@type': 'PostalAddress', streetAddress, addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
  })),
});

export const websiteJsonLd = (origin: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${origin}/#website`,
  name: 'Cosmisol Energy',
  url: origin,
  publisher: { '@id': `${origin}/#organization` },
  inLanguage: 'en-IN',
});

export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

export const breadcrumbJsonLd = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
});

