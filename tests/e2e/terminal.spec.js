const { test, expect } = require('@playwright/test');

test('User can navigate to a post via terminal ls command', async ({ page }) => {
  // 1. Home page loads
  await page.goto('/');

  // 2. User runs "ls" successfully
  const input = page.locator('#current');
  await input.fill('ls');
  await input.press('Enter');

  // Wait for ls output
  // ls output creates .ls-grid or just text items.
  // We look for "My role at Bloomberg" link.
  // We use .first() just in case, but it should be unique.
  const bloombergLink = page.getByText('My role at Bloomberg').first();
  await expect(bloombergLink).toBeVisible();

  // 3. User selects one of the posts
  await bloombergLink.click();

  // Wait for URL to change (implies navigation logic ran)
  // URL might be encoded (exps%2Fbloomberg)
  await expect(page).toHaveURL(/post=exps(%2F|\/)bloomberg/);

  // 4. It loads correctly and doesn't show an error
  // The page overlay appears with h1
  const title = page.locator('h1');
  await expect(title).toContainText('My role at Bloomberg');

  // Verify no error message
  await expect(page.getByText('Error: Post content format is invalid')).not.toBeVisible();
});
