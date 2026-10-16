'use server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export type LoginState = { error: string | null };

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your administrator email and password.' };
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { error: 'The email or password is incorrect.' };
    const { data: profile } = await supabase.from('admin_profiles').select('user_id').eq('user_id', data.user.id).maybeSingle();
    if (!profile) { await supabase.auth.signOut(); return { error: 'The email or password is incorrect.' }; }
  } catch {
    return { error: 'Administrator login is temporarily unavailable.' };
  }
  redirect('/admin');
}

export async function logoutAction() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
