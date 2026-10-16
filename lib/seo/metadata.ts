import type { Metadata, MetadataRoute } from 'next';

const DEFAULT_SITE_URL = 'https://www.cosmisolenergy.com';
const DEFAULT_DESCRIPTION = 'Residential, commercial and industrial solar in Chennai and nearby areas. From site visit and system design to installation and ongoing support, Cosmisol Energy makes solar simple.';
const DEFAULT_SOCIAL_IMAGE = '/images/hero-residential.png';

export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return DEFAULT_SITE_URL;

  try {
    const url = new URL(configured);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return DEFAULT_SITE_URL;
    if (url.hostname === 'vercel.app' || url.hostname.endsWith('.vercel.app')) return DEFAULT_SITE_URL;
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function siteMetadata(origin = siteUrl()): Metadata {
  return {
    metadataBase: new URL(origin),
    title: { default: 'Cosmisol Energy | Solar in Chennai', template: '%s | Cosmisol Energy' },
    description: DEFAULT_DESCRIPTION,
    applicationName: 'Cosmisol Energy',
    openGraph: {
      type: 'website',
      siteName: 'Cosmisol Energy',
      title: 'Cosmisol Energy | Solar in Chennai',
      description: DEFAULT_DESCRIPTION,
      url: '/',
      images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: 'Residential rooftop solar by Cosmisol Energy' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cosmisol Energy | Solar in Chennai',
      description: DEFAULT_DESCRIPTION,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  };
}

export function pageMetadata({ title, description, path, noIndex = false }: { title: string; description: string; path: string; noIndex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'Cosmisol Energy',
      title,
      description,
      url: path,
      images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: 'Residential rooftop solar by Cosmisol Energy' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_SOCIAL_IMAGE] },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function publishedSitemapEntries(rows: Array<{ slug: string; status: string; updated_at?: string | null }>, kind: 'blog' | 'projects', origin = siteUrl()): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];
  for (const row of rows) {
    if (row.status !== 'published' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug) || seen.has(row.slug)) continue;
    seen.add(row.slug);
    const lastModified = row.updated_at ? new Date(row.updated_at) : undefined;
    entries.push({ url: `${origin}/${kind}/${encodeURIComponent(row.slug)}`, ...(lastModified && !Number.isNaN(lastModified.getTime()) ? { lastModified } : {}) });
  }
  return entries;
}

export function articleMetadata(post: any): Metadata {
  const title = post.seo_title?.trim() || post.title;
  const description = post.seo_description?.trim() || post.excerpt;
  const image = post.social_image_url?.trim() || post.cover_image_url || DEFAULT_SOCIAL_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${encodeURIComponent(post.slug)}` },
    openGraph: { type: 'article', siteName: 'Cosmisol Energy', title, description, url: `/blog/${encodeURIComponent(post.slug)}`, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function projectMetadata(project: any): Metadata {
  const title = project.seo_title?.trim() || project.title;
  const description = project.seo_description?.trim() || project.summary;
  const image = project.social_image_url?.trim() || project.cover_image_url || DEFAULT_SOCIAL_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${encodeURIComponent(project.slug)}` },
    openGraph: { type: 'article', siteName: 'Cosmisol Energy', title, description, url: `/projects/${encodeURIComponent(project.slug)}`, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
