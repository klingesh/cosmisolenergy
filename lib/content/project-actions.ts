'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServerClient } from '@/lib/supabase/server';
import { projectInputSchema } from './project-schema';
import { projectPublicationData } from './project-policy';

export async function saveProject(input: unknown, id?: string) {
  await requireAdmin();
  const parsed = projectInputSchema.safeParse(input);
  if (!parsed.success) {
    const names: Record<string, string> = {
      title: 'project title', slug: 'slug', summary: 'summary', projectType: 'project type',
      location: 'location', capacityValue: 'capacity', capacityUnit: 'capacity unit',
      completionDate: 'completion date', coverImageUrl: 'cover image', coverImageAlt: 'cover image alt text',
      gallery: 'gallery image and alt text', solution: 'Cosmisol Energy solution', outcome: 'outcome',
      testimonialConsentConfirmed: 'customer consent',
    };
    const fields = [...new Set(parsed.error.issues.map(issue => names[String(issue.path[0])] ?? String(issue.path[0])))];
    return { ok: false as const, error: `Check these project fields: ${fields.join(', ')}. Use lowercase letters, numbers and hyphens for the slug.` };
  }
  const p = parsed.data; const client: any = await createServerClient();
  let existing: any = null;
  if (id) { const result = await client.from('projects').select('slug,published_at').eq('id', id).maybeSingle(); existing = result.data; }
  const slug = existing?.published_at ? existing.slug : p.slug;
  const publication = projectPublicationData(p.status, existing?.published_at ?? null);
  const row = { title:p.title,slug,summary:p.summary,project_type:p.projectType,location:p.location,capacity_value:p.capacityValue,capacity_unit:p.capacityUnit,completion_date:p.completionDate,cover_image_url:p.coverImageUrl,cover_image_alt:p.coverImageAlt,challenge:p.challenge,solution:p.solution,outcome:p.outcome,generation_value:p.generation?.value??null,generation_period:p.generation?.period??null,generation_source:p.generation?.source??null,savings_value:p.savings?.value??null,savings_period:p.savings?.period??null,savings_source:p.savings?.source??null,testimonial:p.testimonial?.trim()||null,customer_display_name:p.customerDisplayName?.trim()||null,testimonial_consent_confirmed:p.testimonialConsentConfirmed,featured:p.featured,seo_title:p.seoTitle?.trim()||null,seo_description:p.seoDescription?.trim()||null,social_image_url:p.socialImageUrl?.trim()||null,...publication };
  let projectId = id;
  if (id) { const { error } = await client.from('projects').update(row).eq('id', id); if (error) throw new Error('Unable to update project.'); }
  else {
    const draftRow = { ...row, status: 'draft', published_at: null };
    const { data, error } = await client.from('projects').insert(draftRow).select('id').single();
    if (error || !data) throw new Error('Unable to create project.'); projectId = data.id;
  }
  const images = p.gallery.map((image) => ({ image_url:image.imageUrl,alt_text:image.altText,width:image.width,height:image.height,display_order:image.displayOrder }));
  const { error: imageError } = await client.rpc('replace_project_images', { p_project_id: projectId, p_images: images });
  if (imageError) throw new Error('The project was saved, but its previous gallery was preserved because the new gallery could not be validated.');
  if (!id && p.status === 'published') { const { error } = await client.from('projects').update(publication).eq('id', projectId); if (error) throw new Error('Project saved as a draft because publication could not be completed.'); }
  revalidatePath('/projects'); revalidatePath('/');
  return { ok: true as const, id: projectId as string };
}
export async function createProject(input:unknown){return saveProject(input)}
export async function updateProject(id:string,input:unknown){return saveProject(input,id)}
export async function setProjectStatus(id:string,status:'draft'|'published') {await requireAdmin();const client:any=await createServerClient();const{data}=await client.from('projects').select('published_at').eq('id',id).maybeSingle();const{error}=await client.from('projects').update(projectPublicationData(status,data?.published_at??null)).eq('id',id);if(error)throw new Error('Unable to update project status.');revalidatePath('/projects');revalidatePath('/')}
export async function deleteProject(id:string,confirmed:boolean){if(!confirmed)throw new Error('Deletion must be confirmed.');await requireAdmin();const client:any=await createServerClient();const{error}=await client.from('projects').delete().eq('id',id);if(error)throw new Error('Unable to delete project.');revalidatePath('/projects');revalidatePath('/')}
