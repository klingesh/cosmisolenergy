import { expect, test } from '@playwright/test';

test('exposes the approved public journey and legal links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Calculator' })).toHaveCount(0);
  await expect(page.locator('#solutions').getByText('Solar services', { exact: true })).toBeVisible();
  await expect(page.getByText('Site visit', { exact: true })).toBeVisible();
  await expect(page.getByText('After-sales support', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
});

test('calculates the approved solar estimate', async ({ page }) => {
  await page.goto('/#calculator');
  await page.getByLabel('Monthly electricity bill').fill('4600');
  await page.getByRole('button', { name: 'Calculate savings' }).click();
  await expect(page.getByText('2.6 kW')).toBeVisible();
  await expect(page.getByText('₹27,600')).toBeVisible();
});

test('creates a WhatsApp enquiry URL', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Contact Cosmisol Energy on WhatsApp' })).toHaveAttribute('href', /7339617710/);
});
