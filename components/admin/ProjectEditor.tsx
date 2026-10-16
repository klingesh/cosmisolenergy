'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createProject, deleteProject, updateProject } from '@/lib/content/project-actions';
import { toSlug } from '@/lib/content/slug';
import { RichTextEditor } from './RichTextEditor';
import { MediaUploader } from './MediaUploader';
import { useUnsavedChanges } from './useUnsavedChanges';

const doc = { type: 'doc', content: [{ type: 'paragraph' }] };
const emptyImage = (displayOrder: number) => ({ imageUrl: '', altText: '', width: 1200, height: 800, displayOrder });
const blank = { title: '', slug: '', summary: '', projectType: 'residential', location: '', capacityValue: 1, capacityUnit: 'kW', completionDate: '', coverImageUrl: '', coverImageAlt: '', gallery: [emptyImage(0)], challenge: doc, solution: doc, outcome: doc, generation: null, savings: null, testimonial: '', customerDisplayName: '', testimonialConsentConfirmed: false, featured: false, status: 'draft', seoTitle: '', seoDescription: '', socialImageUrl: '' };

export function ProjectEditor({ project }: { project?: any }) {
  const router = useRouter();
  const [v, setV] = useState({ ...blank, ...(project ?? {}), gallery: project?.gallery?.length ? project.gallery : [emptyImage(0)] });
  const [msg, setMsg] = useState('');
  const [dirty, setDirty] = useState(false);
  const change = (next: any) => { setV(next); setDirty(true); };
  useUnsavedChanges(dirty);
  const updateImage = (index: number, patch: any) => { const gallery = v.gallery.map((image: any, position: number) => position === index ? { ...image, ...patch } : image); change({ ...v, gallery, coverImageUrl: gallery[0].imageUrl, coverImageAlt: gallery[0].altText }); };
  const addImage = () => change({ ...v, gallery: [...v.gallery, emptyImage(v.gallery.length)] });
  const removeImage = (index: number) => { if (v.gallery.length === 1) return; const gallery = v.gallery.filter((_: any, position: number) => position !== index).map((image: any, displayOrder: number) => ({ ...image, displayOrder })); change({ ...v, gallery, coverImageUrl: gallery[0].imageUrl, coverImageAlt: gallery[0].altText }); };
  const setClaim = (key: 'generation' | 'savings', field: 'value' | 'period' | 'source', raw: string) => { if (field === 'value' && raw === '') return change({ ...v, [key]: null }); const current = v[key] ?? { value: 0, period: 'per year', source: 'estimated' }; change({ ...v, [key]: { ...current, [field]: field === 'value' ? Number(raw) : raw } }); };
  async function submit(event: FormEvent) { event.preventDefault(); setMsg('Saving…'); try { const saved = project?.id ? await updateProject(project.id, v) : await createProject(v); if (!saved.ok) { setMsg(saved.error); return; } setDirty(false); setMsg('Saved.'); if (!project?.id && saved.id) router.replace(`/admin/projects/${saved.id}`); } catch (error) { setMsg(error instanceof Error ? error.message : 'Unable to save.'); } }
  async function remove() { if (project?.id && confirm('Delete this project permanently?')) { await deleteProject(project.id, true); router.push('/admin/projects'); } }
  return <form className="content-editor" onSubmit={submit}>
    <p className="required-note"><span aria-hidden="true">*</span> Required fields</p>
    <label><span>Project title <span className="required-star" aria-hidden="true">*</span></span><input required minLength={3} value={v.title} onChange={(e) => change({ ...v, title: e.target.value, slug: v.slug || toSlug(e.target.value) })} /></label>
    <label><span>Slug <span className="required-star" aria-hidden="true">*</span></span><input required value={v.slug} disabled={Boolean(project?.publishedAt)} title={project?.publishedAt ? 'Published URLs are permanent.' : undefined} onChange={(e) => change({ ...v, slug: toSlug(e.target.value) })} /></label>
    <label><span>Summary <span className="required-star" aria-hidden="true">*</span></span><textarea required minLength={20} value={v.summary} onChange={(e) => change({ ...v, summary: e.target.value })} /></label>
    <label>Project type<select value={v.projectType} onChange={(e) => change({ ...v, projectType: e.target.value })}><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="industrial">Industrial</option></select></label>
    <label><span>Location <span className="required-star" aria-hidden="true">*</span></span><input required minLength={2} value={v.location} onChange={(e) => change({ ...v, location: e.target.value })} /></label>
    <div className="field-row"><label><span>Capacity <span className="required-star" aria-hidden="true">*</span></span><input required type="number" min="0.1" step="0.1" value={v.capacityValue} onChange={(e) => change({ ...v, capacityValue: Number(e.target.value) })} /></label><label>Unit<select value={v.capacityUnit} onChange={(e) => change({ ...v, capacityUnit: e.target.value })}><option>kW</option><option>MW</option></select></label><label><span>Completion date <span className="required-star" aria-hidden="true">*</span></span><input required type="date" value={v.completionDate} onChange={(e) => change({ ...v, completionDate: e.target.value })} /></label></div>
    <fieldset className="editor-group"><legend>Project gallery</legend><p>The first image is used as the project cover.</p>
      {v.gallery.map((image: any, index: number) => <div className="gallery-editor" key={index}>
        <label><span>{`Gallery image URL ${index + 1}`} <span className="required-star" aria-hidden="true">*</span></span><input required aria-label={`Gallery image URL ${index + 1}`} value={image.imageUrl} onChange={(e) => updateImage(index, { imageUrl: e.target.value })} /><MediaUploader path="projects" onUploaded={(url) => updateImage(index, { imageUrl: url })} /></label>
        <label><span>{`Gallery image alt text ${index + 1}`} <span className="required-star" aria-hidden="true">*</span></span><input required minLength={3} value={image.altText} onChange={(e) => updateImage(index, { altText: e.target.value })} /></label>
        <div className="field-row"><label>Width<input required type="number" min="1" value={image.width} onChange={(e) => updateImage(index, { width: Number(e.target.value) })} /></label><label>Height<input required type="number" min="1" value={image.height} onChange={(e) => updateImage(index, { height: Number(e.target.value) })} /></label></div>
        {v.gallery.length > 1 && <button type="button" onClick={() => removeImage(index)}>Remove image</button>}
      </div>)}<button type="button" onClick={addImage}>Add gallery image</button>
    </fieldset>
    <label>Customer challenge<RichTextEditor initial={v.challenge ?? doc} onChange={(challenge) => change({ ...v, challenge })} /></label>
    <label>Cosmisol Energy solution<RichTextEditor initial={v.solution} onChange={(solution) => change({ ...v, solution })} /></label>
    <label>Outcome<RichTextEditor initial={v.outcome} onChange={(outcome) => change({ ...v, outcome })} /></label>
    <fieldset className="editor-group"><legend>Verified results</legend><p>Leave a claim empty when no supporting evidence is available.</p>
      <div className="field-row"><label>Generation value<input type="number" min="0" step="0.1" value={v.generation?.value ?? ''} onChange={(e) => setClaim('generation', 'value', e.target.value)} /></label><label>Generation period<input value={v.generation?.period ?? 'per year'} onChange={(e) => setClaim('generation', 'period', e.target.value)} /></label><label>Generation source<select value={v.generation?.source ?? 'estimated'} onChange={(e) => setClaim('generation', 'source', e.target.value)}><option value="measured">Measured</option><option value="customer_reported">Customer reported</option><option value="estimated">Estimated</option></select></label></div>
      <div className="field-row"><label>Savings value<input type="number" min="0" step="0.1" value={v.savings?.value ?? ''} onChange={(e) => setClaim('savings', 'value', e.target.value)} /></label><label>Savings period<input value={v.savings?.period ?? 'per year'} onChange={(e) => setClaim('savings', 'period', e.target.value)} /></label><label>Savings source<select value={v.savings?.source ?? 'estimated'} onChange={(e) => setClaim('savings', 'source', e.target.value)}><option value="measured">Measured</option><option value="customer_reported">Customer reported</option><option value="estimated">Estimated</option></select></label></div>
    </fieldset>
    <label>Customer testimonial<textarea value={v.testimonial ?? ''} onChange={(e) => change({ ...v, testimonial: e.target.value || null })} /></label><label>Customer display name<input value={v.customerDisplayName ?? ''} onChange={(e) => change({ ...v, customerDisplayName: e.target.value || null })} /></label><label><input type="checkbox" checked={v.testimonialConsentConfirmed} onChange={(e) => change({ ...v, testimonialConsentConfirmed: e.target.checked })} /> Customer consent confirmed for this testimonial</label>
    <fieldset className="editor-group"><legend>Search and social preview</legend><label>SEO title<input maxLength={60} value={v.seoTitle ?? ''} onChange={(e) => change({ ...v, seoTitle: e.target.value || null })} /></label><label>SEO description<textarea maxLength={160} value={v.seoDescription ?? ''} onChange={(e) => change({ ...v, seoDescription: e.target.value || null })} /></label><label>Social image URL<input value={v.socialImageUrl ?? ''} onChange={(e) => change({ ...v, socialImageUrl: e.target.value || null })} /></label></fieldset>
    <label>Status<select value={v.status} onChange={(e) => change({ ...v, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label><label><input type="checkbox" checked={v.featured} onChange={(e) => change({ ...v, featured: e.target.checked })} /> Featured</label>
    <div className="editor-actions"><button className="button">Save project</button>{project?.id && <><Link href={`/admin/projects/${project.id}/preview`} target="_blank">Preview</Link><button type="button" onClick={remove}>Delete</button></>}</div><p aria-live="polite">{msg}</p>
  </form>;
}
