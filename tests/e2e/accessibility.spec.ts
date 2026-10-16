import { expect, test } from '@playwright/test';

test('public pages expose landmarks, one main heading and visible keyboard focus', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

  await page.keyboard.press('Tab');
  const focused = page.locator(':focus-visible');
  await expect(focused).toBeVisible();
  await expect(focused).toHaveCSS('outline-style', 'solid');
});

test('meaningful images have alternative text and reduced motion disables looping animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  for (const image of await page.locator('img').all()) {
    await expect(image).toHaveAttribute('alt');
  }
  await expect(page.locator('.brands__track')).toHaveCSS('animation-name', 'none');
});

test('not found page is useful and accessible', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: /page not found/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /return home/i })).toBeVisible();
});
