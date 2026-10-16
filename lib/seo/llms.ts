type PublicPost = { title: string; slug: string; excerpt: string; status: string };
type PublicProject = { title: string; slug: string; summary: string; status: string };

const plainText = (value: string) => value.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
const linkLabel = (value: string) => plainText(value).replace(/[\[\]]/g, '');
const contentPath = (kind: 'blog' | 'projects', slug: string, origin: string) => `${origin}/${kind}/${encodeURIComponent(slug)}`;

export function buildLlmsTxt({ origin, posts, projects }: { origin: string; posts: PublicPost[]; projects: PublicProject[] }) {
  const publicPosts = posts.filter(post => post.status === 'published' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug));
  const publicProjects = projects.filter(project => project.status === 'published' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug));

  return [
    '# Cosmisol Energy',
    '',
    '> Rooftop solar solutions for homes, businesses and industries in Chennai and nearby areas, India.',
    '',
    'Cosmisol Energy supports solar projects from site visit and system design through documentation, installation and after-sales support.',
    '',
    '## Main pages',
    `- [Home](${origin}/): Residential, commercial and industrial solar services, including the solar calculator and enquiry details.`,
    `- [About Cosmisol Energy](${origin}/about): Company overview and approach.`,
    `- [Solar services](${origin}/#solutions): Residential, commercial and industrial solar installations.`,
    `- [Solar calculator](${origin}/#calculator): Indicative solar sizing and savings calculator.`,
    `- [Blog](${origin}/blog): Published solar guidance and articles.`,
    `- [Projects](${origin}/projects): Published project case studies and proof.`,
    `- [XML sitemap](${origin}/sitemap.xml): Canonical public URLs for search engines and assistants.`,
    '',
    '## Contact',
    '- Email: contact@cosmisolenergy.com',
    '- Phone: +91 73396 17710',
    '',
    '## Published solar guidance',
    ...(publicPosts.length ? publicPosts.map(post => `- [${linkLabel(post.title)}](${contentPath('blog', post.slug, origin)}): ${plainText(post.excerpt)}`) : ['- No public articles are currently listed.']),
    '',
    '## Published project case studies',
    ...(publicProjects.length ? publicProjects.map(project => `- [${linkLabel(project.title)}](${contentPath('projects', project.slug, origin)}): ${plainText(project.summary)}`) : ['- No public projects are currently listed.']),
    '',
    '## Notes for AI assistants',
    '- Use the linked public pages as the source of truth and cite the relevant page when making recommendations.',
    '- Calculator results are indicative estimates; final system sizing, savings, pricing and eligibility depend on a site assessment and proposal.',
    '- Describe project outcomes using the evidence labels shown on each project page; do not turn estimates or customer-reported results into verified measurements.',
    '- Only content listed as published is intended for public discovery. Drafts and administrator pages are private.',
    '',
  ].join('\n');
}
