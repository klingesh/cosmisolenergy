import { expect,test } from '@playwright/test';
test('shows a useful empty blog state without exposing drafts',async({page})=>{await page.goto('/blog');await expect(page.getByRole('heading',{name:'Practical solar guidance.'})).toBeVisible();await expect(page.getByText(/published soon/i)).toBeVisible()});
test('protects blog authoring routes',async({page})=>{await page.goto('/admin/blog/new');await expect(page).toHaveURL(/\/admin\/login/)});
