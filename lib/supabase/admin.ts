import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { publicSupabaseEnv } from './env';
import type { Database } from '@/types/database';

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY');
  return createClient<Database>(publicSupabaseEnv().url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
