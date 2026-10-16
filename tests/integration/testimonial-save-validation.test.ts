import { beforeEach, describe, expect, it, vi } from 'vitest';

const { requireAdmin, createServerClient } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  createServerClient: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth/require-admin', () => ({ requireAdmin }));
vi.mock('@/lib/supabase/server', () => ({ createServerClient }));

import { createTestimonial } from '@/lib/content/testimonial-actions';

const input = {
  customerName: 'Asha',
  attribution: 'Homeowner',
  quote: 'Too short',
  photoUrl: null,
  photoAlt: null,
  projectId: null,
  featured: false,
  displayOrder: 0,
  consentConfirmed: false,
  status: 'draft' as const,
};

describe('testimonial save validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue({ id: 'admin' });
  });

  it('returns a readable validation result instead of throwing for a short quote', async () => {
    const result = await createTestimonial(input);

    expect(result).toEqual({
      ok: false,
      error: 'Testimonial quote must be at least 20 characters.',
    });
    expect(createServerClient).not.toHaveBeenCalled();
  });
});
