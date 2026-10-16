import { createClient } from '@supabase/supabase-js';

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const url = required('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = required('SUPABASE_SERVICE_ROLE_KEY');
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const db = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

const paragraph = (text: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });

const article = {
  title: 'SAMPLE — How to prepare for a solar site visit',
  slug: 'sample-prepare-for-solar-site-visit',
  excerpt: 'SAMPLE CONTENT: a short checklist showing the article workflow. Review, rewrite and replace this draft before publishing.',
  cover_image_url: `${siteUrl}/images/step-site-visit.png`,
  cover_image_alt: 'Sample illustration of a solar site assessment',
  body: paragraph('SAMPLE CONTENT — Replace this draft with verified Cosmisol guidance before publishing. Confirm the property address, keep a recent electricity bill ready and make roof areas accessible where safe.'),
  category: 'Getting started',
  author_name: 'Cosmisol team',
  featured: false,
  status: 'draft',
  published_at: null,
  seo_title: 'SAMPLE — Preparing for a solar site visit',
  seo_description: 'Sample draft used to test Cosmisol’s article publishing workflow.',
};

const { error: articleError } = await db.from('blog_posts').upsert(article, { onConflict: 'slug' });
if (articleError) throw articleError;

const project = {
  title: 'SAMPLE — Residential rooftop solar project',
  slug: 'sample-residential-rooftop-solar-project',
  summary: 'SAMPLE CONTENT: a fictional, claim-free record used only to test the project publishing workflow.',
  project_type: 'residential',
  location: 'Sample location — replace before publishing',
  capacity_value: 1,
  capacity_unit: 'kW',
  completion_date: '2026-01-01',
  cover_image_url: `${siteUrl}/images/hero-residential.png`,
  cover_image_alt: 'Sample residential building with rooftop solar panels',
  challenge: paragraph('SAMPLE CONTENT — Add only a verified description of the customer’s requirement.'),
  solution: paragraph('SAMPLE CONTENT — Add the verified system design and installation approach.'),
  outcome: paragraph('SAMPLE CONTENT — Add verified outcomes and label every performance claim with its source.'),
  generation_value: null,
  generation_period: null,
  generation_source: null,
  savings_value: null,
  savings_period: null,
  savings_source: null,
  testimonial: null,
  customer_display_name: null,
  featured: false,
  status: 'draft',
  published_at: null,
  seo_title: 'SAMPLE — Residential rooftop solar project',
  seo_description: 'Sample draft used to test Cosmisol’s project publishing workflow.',
};

const { data: savedProject, error: projectError } = await db
  .from('projects')
  .upsert(project, { onConflict: 'slug' })
  .select('id')
  .single();
if (projectError || !savedProject) throw projectError ?? new Error('Sample project was not returned.');

const { error: clearImagesError } = await db.from('project_images').delete().eq('project_id', savedProject.id);
if (clearImagesError) throw clearImagesError;
const { error: imageError } = await db.from('project_images').insert({
  project_id: savedProject.id,
  image_url: `${siteUrl}/images/hero-residential.png`,
  alt_text: 'Sample residential building with rooftop solar panels',
  width: 1600,
  height: 1000,
  display_order: 0,
});
if (imageError) throw imageError;

console.log('Seeded one SAMPLE draft article and one SAMPLE draft project. No testimonials were created.');

