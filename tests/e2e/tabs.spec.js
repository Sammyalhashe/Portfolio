const { test, expect } = require('@playwright/test');

test('Tab System Integration Test', async ({ page }) => {
  // 1. Go to homepage
  await page.goto('/');

  // 2. Verify Tab #1 exists
  const tab1 = page.locator('.tab-item').first();
  await expect(tab1).toContainText('Tab #1');
  await expect(tab1).toHaveClass(/active/);

  // 3. Create a new tab using command
  const input = page.locator('.prompt-input > input').last();
  await input.fill('tab new');
  await input.press('Enter');

  // 4. Verify Tab #2 exists and is active
  const tab2 = page.locator('.tab-item').nth(1);
  await expect(tab2).toContainText('Tab #2');
  await expect(tab2).toHaveClass(/active/);
  // Verify Tab #1 is inactive
  await expect(tab1).not.toHaveClass(/active/);

  // 5. Run a command in the new tab
  await input.fill('info');
  await input.press('Enter');

  // Verify info output is present in the current shell
  // We look for text unique to info command
  const infoOutput = page.getByText('My name is Sammy Al Hashemi').last();
  await expect(infoOutput).toBeVisible();

  // 6. Split the terminal
  await input.fill('right');
  await input.press('Enter');

  // Verify multiple shells exist
  // We expect 2 shells in the current view?
  // WindowTree renders shells. If split, there should be multiple .shell elements in DOM?
  // Or at least visible ones.
  // Let's count .shell elements.
  // Note: Tab #1 has 1 shell. Tab #2 has 2 shells.
  // But only active tab is rendered?
  // In `WindowTree.render`:
  // `<div className="main-content" ...>{this.renderTree(this.rootNode)}</div>`
  // It only renders the active tab's tree.
  // So we should see 2 shells.
  await expect(page.locator('.shell')).toHaveCount(2);

  // 7. Close the tab using shortcut (Alt+t, x)
  // Shortcuts are global.
  await page.keyboard.down('Alt');
  await page.keyboard.press('t');
  await page.keyboard.up('Alt');
  // Small delay might be needed or handled by next press?
  await page.waitForTimeout(100);
  await page.keyboard.press('x');

  // 8. Verify Tab #2 is gone and Tab #1 is active
  await expect(tab2).not.toBeVisible();
  await expect(tab1).toHaveClass(/active/);
  // Verify we are back to 1 shell (Tab #1 state)
  await expect(page.locator('.shell')).toHaveCount(1);
});
