import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServerClient } from '@/lib/supabase/server';
import { ProjectGallery } from '@/components/content/ProjectGallery';
import { ProjectNarrativeSections } from '@/components/content/ProjectNarrativeSections';

export const metadata = { robots: { index: false, follow: false } };

export default async function ProjectPreview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const client = await createServerClient();
  const { data } = await client.from('projects').select('*,project_images(*)').eq('id', id).maybeSingle();
  if (!data) notFound();
  const project: any = data;
  return <main className="legal wrap"><p className="eyebrow">Protected preview · {project.status}</p><h1>{project.title}</h1><p>{project.location} · {project.capacity_value} {project.capacity_unit}</p><p>{project.summary}</p><ProjectGallery images={project.project_images ?? []}/><ProjectNarrativeSections challenge={project.challenge} solution={project.solution} outcome={project.outcome}/>{project.testimonial && <blockquote>“{project.testimonial}”{project.customer_display_name && <footer>— {project.customer_display_name}</footer>}</blockquote>}</main>;
}
