import { describe, expect, it } from 'vitest';
import { summariseContentCounts } from '@/lib/content/admin-dashboard';

describe('admin dashboard counts', () => {
  it('summarises drafts and published items across every managed collection', () => {
    expect(summariseContentCounts([
      [{ status: 'draft' }, { status: 'published' }],
      [{ status: 'published' }],
      [{ status: 'draft' }],
    ])).toEqual({ drafts: 2, published: 2 });
  });
});
