import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

type AdminClient = {
  auth: { getUser(): Promise<{ data: { user: { id: string; email?: string } | null }; error: unknown }> };
  from(table: 'admin_profiles'): {
    select(columns: string): { eq(column: string, value: string): { maybeSingle(): Promise<{ data: { user_id: string; display_name: string } | null; error: unknown }> } };
  };
};

export type AdminProfile = { userId: string; displayName: string; email: string | null };

export async function verifyAdmin(client: AdminClient): Promise<AdminProfile> {
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) throw new Error('ADMIN_REQUIRED');
  const { data: profile, error: profileError } = await client.from('admin_profiles').select('user_id, display_name').eq('user_id', user.id).maybeSingle();
  if (profileError || !profile) throw new Error('ADMIN_REQUIRED');
  return { userId: profile.user_id, displayName: profile.display_name, email: user.email ?? null };
}

export async function requireAdmin() {
  try {
    return await verifyAdmin(await createServerClient() as unknown as AdminClient);
  } catch {
    redirect('/admin/login');
  }
}
