import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getPublishedTestimonials } from '@/lib/content/testimonial-queries';
import { getPublishedPosts } from '@/lib/content/blog-queries';
import { getPublishedProjects } from '@/lib/content/project-queries';
import { renderLegacyHome } from '@/lib/site/legacy-home';

export async function GET() {
  const [template, testimonials, posts, projects] = await Promise.all([
    readFile(join(process.cwd(), 'public', 'legacy', 'home.html'), 'utf8'),
    getPublishedTestimonials(),
    getPublishedPosts(),
    getPublishedProjects(),
  ]);
  return new Response(renderLegacyHome(template, { testimonials, posts, projects }), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
