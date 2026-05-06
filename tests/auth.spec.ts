import { test, expect } from '@playwright/test';

test.describe('authentication', () => {
  test('sign-in page loads', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  test('unauthenticated user is redirected from /manage', async ({ page }) => {
    await page.goto('/manage');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('shows error on bad credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.getByPlaceholder('Email').fill('bad@example.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('.text-red-500')).toBeVisible();
  });
});
