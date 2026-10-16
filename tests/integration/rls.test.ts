import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = resolve(process.cwd(), 'supabase/migrations/202609190001_content_platform.sql');

describe('content database access policy', () => {
  it('enables RLS on every editorial table', async () => {
    const sql = await readFile(migrationPath, 'utf8');
    for (const table of ['blog_posts', 'projects', 'project_images', 'testimonials', 'admin_profiles']) {
      expect(sql).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it('limits anonymous blog reads to published rows', async () => {
    const sql = await readFile(migrationPath, 'utf8');
    expect(sql).toMatch(/create policy "Public reads published blog posts"[\s\S]+status = 'published'/);
  });

  it('requires an administrator profile for editorial writes', async () => {
    const sql = await readFile(migrationPath, 'utf8');
    expect(sql).toContain('public.is_admin(auth.uid())');
  });
});
