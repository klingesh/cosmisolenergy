import { describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth/require-admin', () => ({ requireAdmin: vi.fn(async () => ({})) }));
vi.mock('@/lib/supabase/server', () => ({ createServerClient: vi.fn() }));

import { createProject } from '@/lib/content/project-actions';
import { createServerClient } from '@/lib/supabase/server';

describe('project validation in the admin action', () => {
  it('returns field errors for an incomplete project without contacting the database', async () => {
    const document = { type: 'doc', content: [] };
    const result = await createProject({ title: 'New project', slug: '', location: '', coverImageUrl: '', gallery: [{ imageUrl: '' }], challenge: null, solution: document, outcome: document });
    expect(result).toMatchObject({ ok: false });
    if (result.ok) throw new Error('Expected validation errors');
    expect(result.error).toMatch(/slug/i);
    expect(result.error).toMatch(/location/i);
    expect(result.error).toMatch(/gallery/i);
    expect(createServerClient).not.toHaveBeenCalled();
  });
});
