import { expect, test } from '@playwright/test';

test('redirects anonymous visitors to the admin login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { name: 'Cosmisol Energy administration' })).toBeVisible();
});

test('does not expose public administrator registration', async ({ page }) => {
  await page.goto('/admin/signup');
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('link', { name: /register|sign up/i })).toHaveCount(0);
});
