import { test, expect } from "@playwright/test";

test("Frontend shows orders from DB", async ({ page }) => {
await page.goto("http://frontend:3000");

await page.waitForResponse(resp =>
  resp.url().includes("/orders") && resp.status() === 200
);

await expect(page.getByText("Keyboardsss")).toBeVisible();
//12345689
});

