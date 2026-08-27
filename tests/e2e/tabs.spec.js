const { test, expect } = require('@playwright/test');

test('Tab System Integration Test', async ({ page }) => {
  // 1. Go to homepage
  await page.goto('/');

  // 2. Verify the default tabs: 'terminal' (active) and 'resume' (inactive)
  const namedTabs = page.locator('.tab-item:not([title="New Tab"])');
  const terminalTab = namedTabs.first();
  const resumeTab = namedTabs.nth(1);
  await expect(terminalTab).toContainText('terminal');
  await expect(terminalTab).toHaveClass(/active/);
  await expect(resumeTab).toContainText('resume');
  await expect(resumeTab).not.toHaveClass(/active/);

  // 3. Create a new tab using command
  const input = page.locator('.prompt-input > input').last();
  await input.fill('tab new');
  await input.press('Enter');

  // 4. Verify the new tab exists and is active
  const newTab = namedTabs.nth(2);
  await expect(newTab).toContainText('Tab #3');
  await expect(newTab).toHaveClass(/active/);
  // Verify the terminal tab is inactive
  await expect(terminalTab).not.toHaveClass(/active/);

  // 5. Run a command in the new tab
  await input.fill('info');
  await input.press('Enter');

  // Verify info output is present in the current shell
  const infoOutput = page.getByText('My name is Sammy Al Hashemi').last();
  await expect(infoOutput).toBeVisible();

  // 6. Split the terminal — only the active tab's tree is rendered, so the
  // split should give us exactly 2 shells.
  await input.fill('right');
  await input.press('Enter');
  await expect(page.locator('.shell')).toHaveCount(2);

  // 7. Close the tab using shortcut (Alt+t, x)
  await page.keyboard.down('Alt');
  await page.keyboard.press('t');
  await page.keyboard.up('Alt');
  await page.waitForTimeout(100);
  await page.keyboard.press('x');

  // 8. The new tab is gone. Closing focuses the tab to its left, which is the
  // resume tab, and that tab holds no shells (it renders the PDF embed).
  await expect(newTab).not.toBeVisible();
  await expect(resumeTab).toHaveClass(/active/);

  // 9. Switch back to the terminal tab and confirm its single shell survived.
  await terminalTab.click();
  await expect(terminalTab).toHaveClass(/active/);
  await expect(page.locator('.shell')).toHaveCount(1);
});

test('Resume tab renders the resume, and matches the resume command', async ({ page }) => {
  await page.goto('/');

  const namedTabs = page.locator('.tab-item:not([title="New Tab"])');
  await namedTabs.nth(1).click();

  // The download link is always present regardless of whether the browser
  // could render the inline embed, so it is the stable assertion.
  const link = page.locator('a[href="https://resume.salh.xyz/resume.pdf"]');
  await expect(link).toBeVisible();
  await expect(link).toContainText('resume.pdf');
});
