'use server';
import { revalidatePath } from 'next/cache';
import { blogInputSchema } from './blog-schema';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createServerClient } from '@/lib/supabase/server';

const revalidateBlog = () => { revalidatePath('/blog'); revalidatePath('/'); revalidatePath('/api/rss'); };

export async function saveBlogPost(input: unknown, id?: string) {
  await requireAdmin(); const parsed = blogInputSchema.parse(input); const client: any = await createServerClient();
  let existing: any = null;
  if (id) { const result = await client.from('blog_posts').select('slug,published_at').eq('id', id).maybeSingle(); existing = result.data; }
  const row: any = { title:parsed.title,slug:existing?.published_at?existing.slug:parsed.slug,excerpt:parsed.excerpt,cover_image_url:parsed.coverImageUrl,cover_image_alt:parsed.coverImageAlt,body:parsed.body,category:parsed.category,author_name:parsed.authorName,status:parsed.status,featured:parsed.featured,published_at:existing?.published_at??(parsed.status==='published'?new Date().toISOString():null),seo_title:parsed.seoTitle?.trim()||null,seo_description:parsed.seoDescription?.trim()||null,social_image_url:parsed.socialImageUrl?.trim()||null };
  const result = id ? await client.from('blog_posts').update(row).eq('id', id).select('id').single() : await client.from('blog_posts').insert(row).select('id').single();
  if (result.error) throw new Error(result.error.code === '23505' ? 'This slug is already in use.' : 'Unable to save the article.');
  revalidateBlog(); return { id: result.data.id as string };
}
export async function setBlogStatus(id:string,status:'draft'|'published'){await requireAdmin();const client:any=await createServerClient();const{data}=await client.from('blog_posts').select('published_at').eq('id',id).maybeSingle();const{error}=await client.from('blog_posts').update({status,published_at:data?.published_at??(status==='published'?new Date().toISOString():null)}).eq('id',id);if(error)throw new Error('Unable to update article status.');revalidateBlog()}
export async function deleteBlogPost(id:string,confirmed:boolean){if(!confirmed)throw new Error('Deletion must be confirmed.');await requireAdmin();const client:any=await createServerClient();const{error}=await client.from('blog_posts').delete().eq('id',id);if(error)throw new Error('Unable to delete the article.');revalidateBlog()}
export async function createBlogPost(input:unknown){return saveBlogPost(input)}
export async function updateBlogPost(id:string,input:unknown){return saveBlogPost(input,id)}
