import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/content/blog-queries';
import { getPublishedProjects } from '@/lib/content/project-queries';
import { publishedSitemapEntries, siteUrl } from '@/lib/seo/metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${origin}/`, priority: 1 },
    { url: `${origin}/about`, priority: 0.7 },
    { url: `${origin}/blog`, priority: 0.7 },
    { url: `${origin}/projects`, priority: 0.7 },
  ];
  const [posts, projects] = await Promise.all([getPublishedPosts(), getPublishedProjects()]);
  return [
    ...staticPages,
    ...publishedSitemapEntries(posts, 'blog', origin),
    ...publishedSitemapEntries(projects, 'projects', origin),
  ];
}
