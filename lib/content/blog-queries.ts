import {createServerClient} from '@/lib/supabase/server';
export async function getPublishedPosts(){try{const client=await createServerClient();const{data}=await client.from('blog_posts').select('*').eq('status','published').order('published_at',{ascending:false});return data??[]}catch{return[]}}
export async function getPublishedPostBySlug(slug:string){try{const client=await createServerClient();const{data}=await client.from('blog_posts').select('*').eq('status','published').eq('slug',slug).maybeSingle();return data}catch{return null}}
