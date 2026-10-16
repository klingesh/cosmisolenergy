import { z } from 'zod';

export const contentStatusSchema = z.enum(['draft', 'published']);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

const richTextSchema = z.object({
  type: z.literal('doc'),
  content: z.array(z.unknown()).default([]),
});

export const publicBlogPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(1),
  coverImageUrl: z.string().min(1),
  coverImageAlt: z.string().min(1),
  body: richTextSchema,
  category: z.string().min(1),
  authorName: z.string().min(1),
  status: z.literal('published'),
  featured: z.boolean(),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  socialImageUrl: z.string().nullable().optional(),
});

export type BlogPost = z.infer<typeof publicBlogPostSchema>;

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  projectType: 'residential' | 'commercial' | 'industrial';
  location: string;
  capacityValue: number;
  capacityUnit: 'kW' | 'MW';
  completionDate: string;
  coverImageUrl: string;
  coverImageAlt: string;
  solution: Record<string, unknown>;
  outcome: Record<string, unknown>;
  status: ContentStatus;
  featured: boolean;
};

export type ProjectImage = {
  id: string;
  projectId: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  width: number;
  height: number;
};

export type Testimonial = {
  id: string;
  customerName: string;
  attribution: string | null;
  quote: string;
  photoUrl: string | null;
  photoAlt: string | null;
  projectId: string | null;
  featured: boolean;
  displayOrder: number;
  consentConfirmed: boolean;
  status: ContentStatus;
};
