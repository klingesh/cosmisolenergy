'use client';

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import { publicSupabaseEnv } from './env';
import type { Database } from '@/types/database';

export function createBrowserClient() {
  const { url, anonKey } = publicSupabaseEnv();
  return createSupabaseBrowserClient<Database>(url, anonKey);
}
