'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBlogPost, deleteBlogPost, updateBlogPost } from '@/lib/content/blog-actions';
import { toSlug } from '@/lib/content/slug';
import { RichTextEditor } from './RichTextEditor';
import { MediaUploader } from './MediaUploader';
import { useUnsavedChanges } from './useUnsavedChanges';

const blank = { title: '', slug: '', excerpt: '', coverImageUrl: '', coverImageAlt: '', body: { type: 'doc', content: [{ type: 'paragraph' }] }, category: 'Residential solar', authorName: 'Cosmisol Energy', status: 'draft' as const, featured: false, seoTitle: '', seoDescription: '', socialImageUrl: '' };

export function BlogEditor({ post }: { post?: any }) {
  const router = useRouter();
  const [value, setValue] = useState({ ...blank, ...(post ?? {}) });
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);
  const change = (next: any) => { setValue(next); setDirty(true); };
  useUnsavedChanges(dirty);
  async function submit(event: FormEvent) { event.preventDefault(); setMessage('Saving…'); try { const saved = post?.id ? await updateBlogPost(post.id, value) : await createBlogPost(value); setDirty(false); setMessage('Saved.'); if (!post?.id && saved.id) router.replace(`/admin/blog/${saved.id}`); } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save.'); } }
  async function remove() { if (!post?.id || !window.confirm('Delete this article permanently?')) return; await deleteBlogPost(post.id, true); router.push('/admin/blog'); }
  return <form className="content-editor" onSubmit={submit}>
    <label>Title<input value={value.title} onChange={(e) => change({ ...value, title: e.target.value, slug: value.slug || toSlug(e.target.value) })} /></label>
    <label>Slug<input value={value.slug} disabled={Boolean(post?.publishedAt)} title={post?.publishedAt ? 'Published URLs are permanent.' : undefined} onChange={(e) => change({ ...value, slug: toSlug(e.target.value) })} /></label>
    <label>Excerpt<textarea value={value.excerpt} onChange={(e) => change({ ...value, excerpt: e.target.value })} /></label>
    <label>Cover image URL<input value={value.coverImageUrl} onChange={(e) => change({ ...value, coverImageUrl: e.target.value })} /><MediaUploader path="blog" onUploaded={(coverImageUrl) => change({ ...value, coverImageUrl })} /></label>
    <label>Cover image alt text<input value={value.coverImageAlt} onChange={(e) => change({ ...value, coverImageAlt: e.target.value })} /></label>
    <label>Category<input value={value.category} onChange={(e) => change({ ...value, category: e.target.value })} /></label>
    <label>Author name<input value={value.authorName} onChange={(e) => change({ ...value, authorName: e.target.value })} /></label>
    <label>Article body<RichTextEditor initial={value.body} onChange={(body) => change({ ...value, body })} /></label>
    <fieldset className="editor-group"><legend>Search and social preview</legend>
      <label>SEO title<input maxLength={60} value={value.seoTitle ?? ''} onChange={(e) => change({ ...value, seoTitle: e.target.value || null })} /></label>
      <label>SEO description<textarea maxLength={160} value={value.seoDescription ?? ''} onChange={(e) => change({ ...value, seoDescription: e.target.value || null })} /></label>
      <label>Social image URL<input value={value.socialImageUrl ?? ''} onChange={(e) => change({ ...value, socialImageUrl: e.target.value || null })} /></label>
    </fieldset>
    <label>Status<select value={value.status} onChange={(e) => change({ ...value, status: e.target.value as 'draft' | 'published' })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
    <label><input type="checkbox" checked={value.featured} onChange={(e) => change({ ...value, featured: e.target.checked })} /> Featured</label>
    <div className="editor-actions"><button className="button" type="submit">Save article</button>{post?.id && <><Link href={`/admin/blog/${post.id}/preview`} target="_blank">Preview</Link><button type="button" onClick={remove}>Delete</button></>}</div><p aria-live="polite">{message}</p>
  </form>;
}
