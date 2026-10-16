import type { ReactNode } from 'react';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { MotionProvider } from '@/components/site/MotionProvider';
import { organizationJsonLd, serializeJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { siteUrl } from '@/lib/seo/metadata';
import { getPublishedPosts } from '@/lib/content/blog-queries';
import { getPublishedProjects } from '@/lib/content/project-queries';

export default async function SiteLayout({children}:{children:ReactNode}) {
  const [projects, posts] = await Promise.all([getPublishedProjects(), getPublishedPosts()]);
  const origin = siteUrl();
  const jsonLd = [organizationJsonLd(origin), websiteJsonLd(origin)];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(jsonLd)}}/><MotionProvider/><Header hasProjects={projects.length > 0} hasPosts={posts.length > 0}/>{children}<Footer/></>;
}
