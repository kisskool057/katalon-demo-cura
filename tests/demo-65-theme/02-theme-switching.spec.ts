import { test, expect } from '../fixtures';

/**
 * DEMO-65: Theme Management - Theme Switching
 *
 * Verify that users can switch between light and dark themes
 * through the hamburger menu and that changes are applied immediately.
 */
test.describe('DEMO-65 - Theme Management: Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first to ensure page context is established
    // Then clear session storage to simulate fresh start
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.clear();
    });
    // Go back to home to start with clean state
    await page.goto('/');
  });

  test('User can switch from light theme to dark theme via hamburger menu', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application and verify light theme is default
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await themeUtils.verifyThemeClass('light');

    // Act: Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Assert: Dark theme should be applied
    await themeUtils.verifyThemeClass('dark');
  });

  test('User can switch from dark theme back to light theme via hamburger menu', async ({ page, themeUtils }) => {
    // Arrange: Navigate and switch to dark theme
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await themeUtils.switchTheme('dark');
    await themeUtils.verifyThemeClass('dark');

    // Act: Switch back to light theme
    await themeUtils.switchTheme('light');

    // Assert: Light theme should be applied
    await themeUtils.verifyThemeClass('light');
  });

  test('Dark theme radio button should be checked after switching', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Ensure the radio input is present (menu not required) then verify state
    await page.waitForSelector('input[name="theme"][value="dark"]');

    // Assert: Dark radio button should be checked
    const darkRadio = page.locator('input[name="theme"][value="dark"]');
    await expect(darkRadio).toBeChecked();
  });

  test('Dark theme CSS class should be applied to body', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Assert: Body should have theme-dark class
    const bodyClasses = await page.locator('body').getAttribute('class');
    expect(bodyClasses).toContain('theme-dark');
  });

  test('Theme should apply immediately without page reload', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get the current URL before theme switch
    const urlBefore = page.url();

    // Act: Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Assert: URL should remain the same (no reload)
    const urlAfter = page.url();
    expect(urlAfter).toBe(urlBefore);

    // Verify dark theme is applied
    await themeUtils.verifyThemeClass('dark');
  });

  test('Light theme radio button should be unchecked when switching to dark', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application (light is default)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Ensure the radio input is present (menu not required) then verify state
    await page.waitForSelector('input[name="theme"][value="light"]');

    // Assert: Light radio button should be unchecked
    const lightRadio = page.locator('input[name="theme"][value="light"]');
    await expect(lightRadio).not.toBeChecked();
  });

})
