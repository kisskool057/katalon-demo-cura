import { test, expect } from '../fixtures';

/**
 * DEMO-65: Theme Management - Theme Persistence
 *
 * Verify that theme preferences are persisted in the session
 * and remain consistent across page interactions and navigation.
 */
test.describe('DEMO-65 - Theme Management: Theme Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage to simulate fresh start
    await page.evaluate(() => {
      sessionStorage.clear();
    });
  });

  test('Theme preference should persist during the session', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Switch to dark theme
    await themeUtils.switchTheme('dark');
    const storedThemeBefore = await themeUtils.getStoredTheme();

    // Navigate to another page (if available, simulate navigation)
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Assert: Theme should still be dark
    await themeUtils.verifyThemeClass('dark');
    const storedThemeAfter = await themeUtils.getStoredTheme();
    expect(storedThemeAfter).toBe(storedThemeBefore);
  });

  test('Dark theme should persist after navigating back to home', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application and switch to dark theme
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await themeUtils.switchTheme('dark');

    // Act: Navigate to another page
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Navigate back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Assert: Dark theme should still be applied
    await themeUtils.verifyThemeClass('dark');

    // Verify radio button state in menu
    await themeUtils.openMenu();
    const darkRadio = page.locator('input[name="theme"][value="dark"]');
    await expect(darkRadio).toBeChecked();
  });

  test('Theme should persist after multiple page navigations', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application and set dark theme
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await themeUtils.switchTheme('dark');

    // Act: Navigate through different pages
    const pages = ['/', '/profile', '/history'];
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Assert: Dark theme should be applied at each page
      await themeUtils.verifyThemeClass('dark');
    }
  });

  test('Switching theme and navigating should maintain the new theme', async ({ page, themeUtils }) => {
    // Arrange: Navigate and switch to dark theme
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await themeUtils.switchTheme('dark');

    // Act: Navigate to profile
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Switch back to light theme
    await themeUtils.switchTheme('light');

    // Navigate back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Assert: Light theme should be applied
    await themeUtils.verifyThemeClass('light');

    // Verify radio button state in menu
    await themeUtils.openMenu();
    const lightRadio = page.locator('input[name="theme"][value="light"]');
    await expect(lightRadio).toBeChecked();
  });

  test('Theme AJAX request should be sent when switching', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Listen for network requests to set-theme.php
    let requestMade = false;
    page.on('request', (request) => {
      if (request.url().includes('set-theme.php')) {
        requestMade = true;
      }
    });

    // Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Assert: AJAX request should have been made to set-theme.php
    expect(requestMade).toBeTruthy();
  });

  test('Theme preference should be sent to server via POST request', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Intercept POST requests to set-theme.php
    let requestBody = '';
    let requestUrl = '';
    page.on('request', (request) => {
      if (request.url().includes('set-theme.php') && request.method() === 'POST') {
        requestUrl = request.url();
        const postData = request.postData();
        if (postData) {
          requestBody = postData;
        }
      }
    });

    // Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Assert: Request should be made to set-theme.php
    expect(requestUrl).toContain('set-theme.php');
    // POST body should contain the theme parameter
    expect(requestBody.length).toBeGreaterThan(0);
  });

  test('Theme should be retrievable from session storage', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Get stored theme
    const storedTheme = await themeUtils.getStoredTheme();

    // Assert: Theme should be stored in session storage
    expect(storedTheme).toBeTruthy();
  });

  test('Switching between themes multiple times should maintain correct state', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act & Assert: Perform multiple switches
    const sequence = ['dark', 'light', 'dark', 'light', 'dark'];

    for (const theme of sequence) {
      await themeUtils.switchTheme(theme as 'light' | 'dark');
      await themeUtils.verifyThemeClass(theme as 'light' | 'dark');
    }
  });

  test('Theme should persist when refreshing the page', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application and switch to dark theme
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await themeUtils.switchTheme('dark');

    // Act: Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Assert: Dark theme should still be applied after refresh
    await themeUtils.verifyThemeClass('dark');
  });
});
