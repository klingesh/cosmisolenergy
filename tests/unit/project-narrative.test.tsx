import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProjectNarrativeSections } from '@/components/content/ProjectNarrativeSections';

const empty = { type: 'doc', content: [{ type: 'paragraph' }] };
const filled = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Rooftop shade was assessed.' }] }] };

describe('project narrative sections', () => {
  it('omits headings and blank paragraphs for empty editor documents', () => {
    expect(renderToStaticMarkup(<ProjectNarrativeSections challenge={empty} solution={empty} outcome={empty} />)).toBe('');
  });

  it('shows only sections that contain real text or an image', () => {
    const html = renderToStaticMarkup(<ProjectNarrativeSections challenge={filled} solution={empty} outcome={{ type: 'doc', content: [{ type: 'image', attrs: { src: '/solar.jpg', alt: 'Solar array' } }] }} />);
    expect(html).toContain('Challenge');
    expect(html).toContain('Rooftop shade was assessed.');
    expect(html).not.toContain('Cosmisol Energy solution');
    expect(html).toContain('Outcome');
    expect(html).toContain('Solar array');
  });
});
