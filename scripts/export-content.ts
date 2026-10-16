import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const db = createClient(required('NEXT_PUBLIC_SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { autoRefreshToken: false, persistSession: false },
});

const tables = ['blog_posts', 'projects', 'project_images', 'testimonials'] as const;
const content: Record<string, unknown[]> = {};
for (const table of tables) {
  const { data, error } = await db.from(table).select('*');
  if (error) throw error;
  content[table] = data ?? [];
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const destination = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(process.env.CONTENT_EXPORT_DIR || 'exports', `cosmisol-content-${timestamp}.json`);
await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, JSON.stringify({ exportedAt: new Date().toISOString(), schemaVersion: 1, content }, null, 2), 'utf8');
console.log(`Exported content to ${destination}`);

