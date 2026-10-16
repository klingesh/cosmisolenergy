import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { renderLegacyHome } from '@/lib/site/legacy-home';

it('renders the Cosmisol Energy homepage brand and site-visit action', () => {
  const template = readFileSync(join(process.cwd(), 'public', 'legacy', 'home.html'), 'utf8');
  const html = renderLegacyHome(template, { posts: [], projects: [], testimonials: [] });
  expect(html).toContain('The right solar');
  expect(html).toContain('<title>Cosmisol Energy | Solar, designed around you.</title>');
  expect(html).toContain('alt="Cosmisol Energy — Energy that works for you"');
  expect(html).not.toContain('Cosmisol');
  expect(html).toContain('Book a free site visit');
  expect(html).toContain('Our locations');
  expect(html).toContain('S. Kulathoor Main Road, Periyakovilambakkam, Chennai-129.');
  expect(html).toContain('1352/A, Sembakkam Road, Eachamballam, Manampathy');
  expect(html).toContain('Casagrand ECR 14, Maya St, Kannathur Reddy Kuppam');
});

