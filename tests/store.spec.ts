import { test, expect } from '@playwright/test';

test.describe('public store', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('/api/places returns JSON array', async ({ request }) => {
    const response = await request.get('/api/places');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('/api/places respects rate limit', async ({ request }) => {
    // Fire 65 requests; the 61st onward should return 429
    const results: number[] = [];
    for (let i = 0; i < 65; i++) {
      const r = await request.get('/api/places');
      results.push(r.status());
    }
    expect(results.filter((s) => s === 429).length).toBeGreaterThan(0);
  });
});
