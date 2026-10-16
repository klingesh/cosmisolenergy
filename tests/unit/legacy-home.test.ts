import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderLegacyHome } from '@/lib/site/legacy-home';

const template = '<html><head><link rel="stylesheet" href="style.css"><script src="calculator.js" defer></script><script src="app.js" defer></script></head><body><img src="logo.png"><a href="about.html">About</a><section class="section wrap visit" id="visit"></section></body></html>';
const navTemplate = template.replace('<a href="about.html">About</a>', '<nav id="navigation"><a href="about.html">About Us</a></nav>');

describe('legacy homepage rendering', () => {
  it('uses the About page palette and typography for homepage sections', () => {
    const stylesheet = readFileSync('public/legacy/style.css', 'utf8');

    expect(stylesheet).toContain('body.home-page{--orange:#f15a2a;--ink:#0b2730;--muted:#5d6d73;--line:#dce3e4;--pale:#f2f7f8;font-family:Arial,Helvetica,sans-serif');
    expect(stylesheet).toContain('.home-page .calculator{background:#f2f7f8;color:#0b2730');
  });

  it('uses the legacy markup with working public asset and page URLs', () => {
    const html = renderLegacyHome(template, { posts: [], projects: [], testimonials: [] });
    expect(html).toContain('href="/legacy/style.css"');
    expect(html).toContain('src="/legacy/app.js"');
    expect(html).toContain('src="/legacy/calculator.js"');
    expect(html).toContain('src="/images/logo.png"');
    expect(html).toContain('href="/about"');
    expect(html).toContain('<section class="section wrap visit" id="visit">');
  });

  it('loads analytics consent controls without loading Google Analytics directly', () => {
    const html = renderLegacyHome(template, { posts: [], projects: [], testimonials: [] });
    expect(html).toContain('<script src="/legacy/analytics-consent.js" defer></script></head>');
    expect(html).not.toContain('https://www.googletagmanager.com/gtag/js');
  });

  it('renders published content safely without changing the legacy hero', () => {
    const html = renderLegacyHome(template, {
      posts: [{ slug: 'solar-guide', title: '<Solar guide>', excerpt: 'Start here', category: 'Guides' }],
      projects: [],
      testimonials: [],
    });
    expect(html).toContain('href="/blog/solar-guide"');
    expect(html).toContain('&lt;Solar guide&gt;');
    expect(html).not.toContain('<Solar guide>');
    expect(html.indexOf('From the journal')).toBeLessThan(html.indexOf('id="visit"'));
  });

  it('renders every published testimonial in an accessible five-second carousel', () => {
    const html = renderLegacyHome(template, {
      posts: [], projects: [],
      testimonials: [
        { quote: 'First <quote>', customerName: 'Asha', attribution: 'Homeowner' },
        { quote: 'Second quote', customerName: 'Ravi' },
      ],
    });
    expect(html).toContain('data-testimonial-carousel');
    expect(html).toContain('data-interval="5000"');
    expect(html).toContain('src="/legacy/testimonials.js"');
    expect(html).toContain('aria-label="Testimonial 1 of 2"');
    expect(html).toContain('aria-label="Testimonial 2 of 2"');
    expect(html).toContain('&lt;quote&gt;');
    expect(html).not.toContain('<quote>');
  });

  it('adds project and blog navigation only when public content exists', () => {
    const empty = renderLegacyHome(navTemplate, { posts: [], projects: [], testimonials: [] });
    expect(empty).not.toContain('href="/projects"');
    expect(empty).not.toContain('href="/blog"');
    const withProjects = renderLegacyHome(navTemplate, { posts: [], projects: [{ slug: 'roof', title: 'Roof', summary: 'Solar roof', location: 'Mumbai', project_type: 'residential' }], testimonials: [] });
    expect(withProjects).toContain('<a href="/projects">Projects</a>');
    expect(withProjects).not.toContain('<a href="/blog">Blog</a>');
    const withBoth = renderLegacyHome(navTemplate, { posts: [{ slug: 'guide', title: 'Guide', excerpt: 'Read', category: 'Solar' }], projects: [{ slug: 'roof', title: 'Roof', summary: 'Solar roof', location: 'Mumbai', project_type: 'residential' }], testimonials: [] });
    expect(withBoth).toContain('<a href="/projects">Projects</a><a href="/blog">Blog</a>');
  });
});
