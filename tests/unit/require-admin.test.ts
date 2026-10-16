import { describe, expect, it } from 'vitest';
import { verifyAdmin } from '@/lib/auth/require-admin';

function fakeClient(user: { id: string; email?: string } | null, profile: { user_id: string; display_name: string } | null) {
  return {
    auth: { getUser: async () => ({ data: { user }, error: user ? null : new Error('No session') }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: profile, error: null }) }) }) }),
  };
}

describe('verifyAdmin', () => {
  it('returns the administrator profile for an allowed session', async () => {
    await expect(verifyAdmin(fakeClient({ id: 'user-1', email: 'admin@cosmisol.co.in' }, { user_id: 'user-1', display_name: 'Cosmisol Admin' }))).resolves.toMatchObject({ displayName: 'Cosmisol Admin' });
  });

  it('rejects an anonymous visitor', async () => {
    await expect(verifyAdmin(fakeClient(null, null))).rejects.toThrow('ADMIN_REQUIRED');
  });

  it('rejects an authenticated user without an administrator profile', async () => {
    await expect(verifyAdmin(fakeClient({ id: 'user-2' }, null))).rejects.toThrow('ADMIN_REQUIRED');
  });
});

