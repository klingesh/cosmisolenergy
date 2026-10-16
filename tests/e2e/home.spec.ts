import { expect, test } from '@playwright/test';

test('loads the Cosmisol Energy homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /right solar solution/i })).toBeVisible();
});
