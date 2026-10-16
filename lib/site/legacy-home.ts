type HomeContent = {
  posts: Array<{ slug: string; title: string; excerpt: string; category: string }>;
  projects: Array<{ slug: string; title: string; summary: string; location: string; project_type: string }>;
  testimonials: Array<{ quote: string; customerName: string; attribution?: string | null }>;
};

import { organizationJsonLd, serializeJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { siteUrl } from '@/lib/seo/metadata';

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character] ?? character);

function contentSections({ posts, projects, testimonials }: HomeContent) {
  const sections: string[] = [];
  if (projects.length) sections.push(`<section class="section wrap legacy-content" id="projects"><p class="eyebrow">OUR WORK</p><h2>Featured projects</h2><div class="legacy-content-grid">${projects.slice(0, 3).map(project => `<article><p class="eyebrow">${escapeHtml(project.project_type)}</p><h3><a href="/projects/${encodeURIComponent(project.slug)}">${escapeHtml(project.title)}</a></h3><p>${escapeHtml(project.location)}</p><p>${escapeHtml(project.summary)}</p></article>`).join('')}</div><a class="legacy-content-link" href="/projects">View all projects ↗</a></section>`);
  if (posts.length) sections.push(`<section class="section wrap legacy-content" id="blog"><p class="eyebrow">FROM THE JOURNAL</p><h2>Latest solar guidance</h2><div class="legacy-content-grid">${posts.slice(0, 3).map(post => `<article><p class="eyebrow">${escapeHtml(post.category)}</p><h3><a href="/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.excerpt)}</p></article>`).join('')}</div><a class="legacy-content-link" href="/blog">Read all articles ↗</a></section>`);
  if (testimonials.length) sections.push(`<section class="section wrap legacy-content legacy-stories" id="stories" aria-labelledby="stories-title"><p class="eyebrow">CLIENT STORIES</p><h2 id="stories-title">What our customers say</h2><div class="testimonial-carousel" data-testimonial-carousel data-interval="5000" aria-roledescription="carousel" aria-label="Client stories"><div class="testimonial-window"><div class="testimonial-track">${testimonials.map((item, index) => `<figure class="testimonial-slide" role="group" aria-roledescription="slide" aria-label="Testimonial ${index + 1} of ${testimonials.length}"><blockquote>“${escapeHtml(item.quote)}”</blockquote><figcaption><strong>${escapeHtml(item.customerName)}</strong>${item.attribution ? `<span>${escapeHtml(item.attribution)}</span>` : ''}</figcaption></figure>`).join('')}</div></div>${testimonials.length > 1 ? `<div class="testimonial-controls"><button type="button" class="testimonial-arrow" data-testimonial-prev aria-label="Previous testimonial">←</button><span class="testimonial-count" aria-hidden="true"><span data-testimonial-current>01</span> / ${String(testimonials.length).padStart(2, '0')}</span><button type="button" class="testimonial-arrow" data-testimonial-next aria-label="Next testimonial">→</button></div>` : ''}</div></section>`);
  return sections.join('');
}

export function renderLegacyHome(template: string, content: HomeContent, origin = siteUrl()) {
  let html = template
    .replace('href="style.css"', 'href="/legacy/style.css"')
    .replace('href="/legacy/style.css"', 'href="/legacy/style.css"><link rel="stylesheet" href="/legacy/content.css"')
    .replace(/src="(app\.js|calculator\.js|motion\.js|vendor\/anime\.umd\.min\.js)"/g, 'src="/legacy/$1"')
    .replace(/src="(logo(?:-hero)?\.png|hero-residential\.png|brands\/[^\"]+)"/g, 'src="/images/$1"')
    .replace(/href="(about|privacy|cookies|terms)\.html"/g, 'href="/$1"');
  const description = 'Residential, commercial and industrial solar in Chennai and nearby areas. From site visit and system design to installation and ongoing support, Cosmisol Energy makes solar simple.';
  const structuredData = serializeJsonLd([organizationJsonLd(origin), websiteJsonLd(origin)]);
  const homeMetadata = `<link rel="canonical" href="${escapeHtml(origin)}/"><meta property="og:type" content="website"><meta property="og:site_name" content="Cosmisol Energy"><meta property="og:title" content="Cosmisol Energy | Solar in Chennai"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(origin)}/"><meta property="og:image" content="${escapeHtml(origin)}/images/hero-residential.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Cosmisol Energy | Solar in Chennai"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(origin)}/images/hero-residential.png"><script type="application/ld+json">${structuredData}</script>`;
  html = html.replace('</head>', `${homeMetadata}</head>`);
  const publicNavigation = `${content.projects.length ? '<a href="/projects">Projects</a>' : ''}${content.posts.length ? '<a href="/blog">Blog</a>' : ''}`;
  if (publicNavigation) html = html.replace('</nav>', `${publicNavigation}</nav>`);
  const marker = '<section class="section wrap visit" id="visit">';
  if (!html.includes(marker)) throw new Error('Legacy homepage visit section is missing.');
  html = html.replace(marker, `${contentSections(content)}${marker}`);
  if (content.testimonials.length > 1) html = html.replace('</body>', '<script src="/legacy/testimonials.js" defer></script></body>');
  html = html.replace('</head>', '<script src="/legacy/analytics-consent.js" defer></script></head>');
  return html;
}
