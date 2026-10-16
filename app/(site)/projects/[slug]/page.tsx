import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedProjectBySlug } from '@/lib/content/project-queries';
import { ProjectNarrativeSections } from '@/components/content/ProjectNarrativeSections';
import { ProjectGallery } from '@/components/content/ProjectGallery';
import { projectMetadata, siteUrl } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/json-ld';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const project = await getPublishedProjectBySlug(slug);
  return project ? projectMetadata(project) : {};
}

const sourceLabel = (source: string) => ({ measured: 'Measured', customer_reported: 'Customer reported', estimated: 'Estimated' }[source] ?? source);

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project: any = await getPublishedProjectBySlug(slug); if (!project) notFound();
  const origin = siteUrl();
  const proof = { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.summary, image: project.social_image_url ?? project.cover_image_url, dateCreated: project.completion_date, creator: { '@type': 'Organization', name: 'Cosmisol Energy' } };
  const breadcrumbs = breadcrumbJsonLd([{ name: 'Home', url: origin }, { name: 'Projects', url: `${origin}/projects` }, { name: project.title, url: `${origin}/projects/${project.slug}` }]);
  return <main className="legal wrap"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd([proof, breadcrumbs]) }} /><p className="eyebrow">{project.project_type} project</p><h1>{project.title}</h1><p>{project.location} · {project.capacity_value} {project.capacity_unit} · Completed {new Date(`${project.completion_date}T00:00:00`).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</p><p>{project.summary}</p><ProjectGallery images={project.project_images ?? []}/><ProjectNarrativeSections challenge={project.challenge} solution={project.solution} outcome={project.outcome}/>{(project.generation_value != null || project.savings_value != null) && <section aria-labelledby="verified-results"><h2 id="verified-results">Verified results</h2>{project.generation_value != null && <p><strong>{project.generation_value} {project.generation_period}</strong> generation · {sourceLabel(project.generation_source)}</p>}{project.savings_value != null && <p><strong>₹{Number(project.savings_value).toLocaleString('en-IN')} {project.savings_period}</strong> savings · {sourceLabel(project.savings_source)}</p>}</section>}{project.testimonial && <blockquote>“{project.testimonial}”{project.customer_display_name && <footer>— {project.customer_display_name}</footer>}</blockquote>}</main>;
}
