import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/require-admin';
import { AdminNav } from '@/components/admin/AdminNav';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { createServerClient } from '@/lib/supabase/server';
import { summariseContentCounts } from '@/lib/content/admin-dashboard';

export default async function AdminPage() {
  const admin = await requireAdmin();
  const client = await createServerClient();
  const [blogs, projects, testimonials] = await Promise.all([
    client.from('blog_posts').select('status'),
    client.from('projects').select('status'),
    client.from('testimonials').select('status'),
  ]);
  const counts = summariseContentCounts([(blogs.data ?? []) as any[], (projects.data ?? []) as any[], (testimonials.data ?? []) as any[]]);
  return <><AdminNav/><section><p className="eyebrow">Dashboard</p><h1>Welcome, {admin.displayName}</h1><DashboardStats {...counts}/><div className="admin-actions"><Link className="button" href="/admin/blog/new">New blog post</Link><Link className="button" href="/admin/projects/new">New project</Link><Link className="button" href="/admin/testimonials/new">New testimonial</Link></div></section></>;
}
