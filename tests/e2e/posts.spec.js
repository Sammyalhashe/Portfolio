const { test, expect } = require('@playwright/test');

test('should load Bloomberg post without error', async ({ page }) => {
  await page.goto('/?post=exps/bloomberg');

  // Verify title is present
  await expect(page.locator('h1')).toContainText('My role at Bloomberg');

  // Verify NO error message (assuming the fix prevents the crash and the loader update makes it valid)
  // If the loader update fails, the fallback UI shows "Error: Post content format is invalid."
  // The user wants it to LOAD, not just show error.
  // With the loader update (3.7.0), it SHOULD load content.
  // So I expect NOT to see the error message.
  await expect(page.getByText('Error: Post content format is invalid')).not.toBeVisible();
});

test('should load a normal post (My First Post)', async ({ page }) => {
  await page.goto('/?post=posts/my-first-post');

  await expect(page.locator('h1')).toContainText('My First Post');
});
