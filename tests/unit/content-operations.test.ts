import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

describe('content operations', () => {
  it('provides runnable seed and export commands', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.scripts['seed:acceptance']).toContain('seed-acceptance-content.ts');
    expect(pkg.scripts['export:content']).toContain('export-content.ts');
  });

  it('keeps sample content as drafts and does not seed testimonials', () => {
    const seed = read('scripts/seed-acceptance-content.ts');
    expect(seed).toContain("status: 'draft'");
    expect(seed).not.toMatch(/from\(['"]testimonials['"]\)/);
    expect(seed).toContain('SAMPLE');
  });

  it('documents publishing, recovery, first-admin and rollback operations', () => {
    const admin = read('docs/admin-guide.md');
    const deployment = read('docs/deployment.md');
    expect(admin).toMatch(/alt text/i);
    expect(admin).toMatch(/unpublish/i);
    expect(admin).toMatch(/claim source/i);
    expect(deployment).toMatch(/first administrator/i);
    expect(deployment).toMatch(/rollback/i);
    expect(deployment).toMatch(/backup|export/i);
  });
});
