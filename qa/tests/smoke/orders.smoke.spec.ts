// tests/smoke/orders.smoke.spec.ts
import { test, expect } from '@playwright/test';

test('Orders page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Orders')).toBeVisible();
});
