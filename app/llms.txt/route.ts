import { getPublishedPosts } from '@/lib/content/blog-queries';
import { getPublishedProjects } from '@/lib/content/project-queries';
import { buildLlmsTxt } from '@/lib/seo/llms';
import { siteUrl } from '@/lib/seo/metadata';

export async function GET() {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getPublishedProjects()]);
  return new Response(buildLlmsTxt({ origin: siteUrl(), posts, projects }), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
