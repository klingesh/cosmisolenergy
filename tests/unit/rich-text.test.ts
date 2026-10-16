import { describe, expect, it } from 'vitest';
import { sanitizeRichText } from '@/lib/content/rich-text';

describe('sanitizeRichText', () => {
  it('retains allowed nodes', () => {
    expect(sanitizeRichText({ type: 'doc', content: [{ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Solar basics' }] }] })).toMatchObject({ type: 'doc' });
  });

  it.each(['script', 'iframe', 'html'])('rejects unsupported %s nodes', (type) => {
    expect(() => sanitizeRichText({ type: 'doc', content: [{ type }] })).toThrow(/unsupported/i);
  });

  it('rejects javascript links', () => {
    const document = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'bad', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] }] }] };
    expect(() => sanitizeRichText(document)).toThrow(/link/i);
  });
});
