import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { publicSupabaseEnv } from './env';
import type { Database } from '@/types/database';

export async function createServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = publicSupabaseEnv();
  return createSupabaseServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; middleware refreshes sessions.
        }
      },
    },
  });
}
