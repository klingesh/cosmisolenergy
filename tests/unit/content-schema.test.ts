import { describe, expect, it } from 'vitest';
import { publicBlogPostSchema } from '@/types/content';

const validPost = {
  id: 'e5de145c-f9d8-4a03-90d8-8a89f7cb6b7b',
  title: 'How rooftop solar works',
  slug: 'how-rooftop-solar-works',
  excerpt: 'A practical introduction.',
  coverImageUrl: '/images/solar.webp',
  coverImageAlt: 'Solar panels on a tiled roof',
  body: { type: 'doc', content: [] },
  category: 'Residential solar',
  authorName: 'Cosmisol',
  status: 'published',
  featured: false,
  publishedAt: '2026-09-19T00:00:00.000Z',
  updatedAt: '2026-09-19T00:00:00.000Z',
};

describe('publicBlogPostSchema', () => {
  it('accepts a published post', () => {
    expect(publicBlogPostSchema.parse(validPost).slug).toBe(validPost.slug);
  });

  it('rejects a draft from the public content boundary', () => {
    expect(() => publicBlogPostSchema.parse({ ...validPost, status: 'draft' })).toThrow();
  });
});

