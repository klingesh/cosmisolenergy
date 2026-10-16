import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedPostBySlug } from '@/lib/content/blog-queries';
import { RichText } from '@/components/content/RichText';
import { articleMetadata, siteUrl } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/json-ld';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const post = await getPublishedPostBySlug(slug);
  return post ? articleMetadata(post) : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post: any = await getPublishedPostBySlug(slug); if (!post) notFound();
  const origin = siteUrl();
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt, datePublished: post.published_at, dateModified: post.updated_at, image: post.social_image_url ?? post.cover_image_url, author: { '@type': 'Organization', name: post.author_name } };
  const breadcrumbs = breadcrumbJsonLd([{ name: 'Home', url: origin }, { name: 'Blog', url: `${origin}/blog` }, { name: post.title, url: `${origin}/blog/${post.slug}` }]);
  return <main className="legal article wrap"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([article, breadcrumbs]) }} /><p className="eyebrow">{post.category}</p><h1>{post.title}</h1><p>{post.excerpt}</p><RichText document={post.body}/></main>;
}
