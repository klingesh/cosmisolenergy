import { expect, test } from '@playwright/test';

test('public responses include the required browser security policy', async ({ request }) => {
  const response = await request.get('/');
  expect(response.headers()['content-security-policy']).toContain("default-src 'self'");
  expect(response.headers()['content-security-policy']).toContain('frame-ancestors');
  expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(response.headers()['permissions-policy']).toContain('camera=()');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
});

test('admin and protected preview routes are excluded from search indexes', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

  await page.goto('/admin/blog/example/preview');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('policy pages accurately disclose current processors and tracking state', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByText(/Supabase/i)).toBeVisible();
  await expect(page.getByText(/Vercel/i)).toBeVisible();
  await expect(page.getByText(/If you choose.*Accept analytics.*Google Analytics/i)).toBeVisible();

  await page.goto('/cookies');
  await expect(page.getByRole('heading', { name: 'Essential cookies' })).toBeVisible();
  await expect(page.getByText(/Google tag loads.*cookieless measurement signals/i)).toBeVisible();
});

test('untrusted script text is rendered as text on a safe 404', async ({ page }) => {
  await page.goto('/%3Cscript%3Ewindow.__xss=1%3C/script%3E');
  expect(await page.evaluate(() => (window as Window & { __xss?: number }).__xss)).toBeUndefined();
  const hasExecutablePayload = await page.locator('script').evaluateAll((scripts) =>
    scripts.some((script) => script.textContent?.trim() === 'window.__xss=1'),
  );
  expect(hasExecutablePayload).toBe(false);
});
