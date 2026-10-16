import { expect, test } from '@playwright/test';

test('visitor can understand the offer and prepare a site visit request', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /right solar solution/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /book a free site visit/i })).toHaveAttribute('href', '#contact');
  await page.getByLabel(/monthly electricity bill/i).fill('4600');
  await page.getByRole('button', { name: /calculate/i }).click();
  await expect(page.getByText('2.6 kW')).toBeVisible();
});

test('public content, legal and discovery routes remain available', async ({ request }) => {
  for (const route of ['/', '/blog', '/projects', '/privacy', '/cookies', '/robots.txt', '/sitemap.xml', '/api/rss']) {
    const response = await request.get(route);
    expect(response.ok(), `${route} should be available`).toBeTruthy();
  }
});

test('private content management stays private', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
