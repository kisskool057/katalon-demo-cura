import { test, expect } from '../fixtures';

/**
 * DEMO-65: Theme Management - Light Theme Default
 *
 * Verify that the light theme is applied by default when the application loads.
 * No theme preference should be required for initial setup.
 * The theme selector is located in the hamburger menu (top right).
 */
test.describe('DEMO-65 - Theme Management: Default Light Theme', () => {
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

  test('Light theme should be applied by default on first load', async ({ page, themeUtils }) => {
    // Arrange & Act: Application already navigated in beforeEach
    await page.waitForLoadState('networkidle');

    // Assert: Verify the light theme is applied
    await themeUtils.verifyThemeClass('light');
  });

  test('Light theme radio button should be selected by default', async ({ page, themeUtils }) => {
    // Arrange & Act: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open the hamburger menu to access theme selector
    await themeUtils.openMenu();

    // Assert: Light theme radio button should be checked
    const lightRadio = page.locator('input[name="theme"][value="light"]');
    await expect(lightRadio).toBeChecked();
  });

  test('Body element should have theme-light class', async ({ page }) => {
    // Arrange & Act: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Assert: Body should contain theme-light class
    const bodyClasses = await page.locator('body').getAttribute('class');
    expect(bodyClasses).toContain('theme-light');
  });

  test('Theme selector should be accessible in the hamburger menu', async ({ page, themeUtils }) => {
    // Arrange & Act: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open the hamburger menu
    await themeUtils.openMenu();

    // Assert: Theme selector should be visible
    const themeForm = page.locator('#theme-form');
    await expect(themeForm).toBeVisible();
  });

  test('Theme radio buttons should be present and accessible in menu', async ({ page, themeUtils }) => {
    // Arrange & Act: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open the hamburger menu
    await themeUtils.openMenu();

    // Assert: Both radio buttons should exist and be visible
    const lightRadio = page.locator('input[name="theme"][value="light"]');
    const darkRadio = page.locator('input[name="theme"][value="dark"]');

    await expect(lightRadio).toBeVisible();
    await expect(darkRadio).toBeVisible();
  });

  test('Hamburger menu toggle button should be visible', async ({ page }) => {
    // Arrange & Act: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Assert: Menu toggle button should be visible
    const menuToggle = page.locator('#menu-toggle');
    await expect(menuToggle).toBeVisible();
  });
});
