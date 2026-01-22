// tests/regression/orders.regression.spec.ts
import { test, expect } from '@playwright/test';

test('@regression Frontend shows orders from DB', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Keyboardss')).toBeVisible();
});
