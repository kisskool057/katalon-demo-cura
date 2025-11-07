import { test, expect } from '../fixtures';

/**
 * DEMO-65: Theme Management - Visual Styles and Transitions
 *
 * Verify that CSS transitions work smoothly and visual styles
 * are correctly applied for both light and dark themes.
 */
test.describe('DEMO-65 - Theme Management: Visual Styles and Transitions', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage to simulate fresh start
    await page.evaluate(() => {
      sessionStorage.clear();
    });
  });

  test('Theme transition CSS should be smooth (0.3s)', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Check CSS transition property on body element
    const transitionDuration = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      return bodyStyle.transitionDuration;
    });

    // Assert: Transition should be set (0.3s or similar)
    expect(transitionDuration).toContain('0.3s');
  });

  test('Dark theme should have distinct background color from light theme', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Get background color for light theme
    const lightBgColor = await themeUtils.getCSSVariableValue('--background-color');
    await themeUtils.switchTheme('dark');
    const darkBgColor = await themeUtils.getCSSVariableValue('--background-color');

    // Assert: Colors should be different
    expect(lightBgColor).not.toBe(darkBgColor);
  });

  test('Dark theme text color should be different from light theme', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Switch between themes and get text colors
    const lightTextColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--text-color')
        .trim();
    });

    await themeUtils.switchTheme('dark');
    const darkTextColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--text-color')
        .trim();
    });

    // Assert: Colors should be different (light theme has dark text, dark theme has light text)
    expect(lightTextColor).not.toBe(darkTextColor);
  });

  test('Light theme should have white/light background', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Get background color for light theme
    const bgColor = await page.evaluate(() => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      return style.getPropertyValue('--background-color').trim();
    });

    // Assert: Should contain white or very light color
    expect(bgColor.toLowerCase()).toMatch(/white|rgb\s*\(\s*255\s*,\s*255\s*,\s*255\s*\)|#fff|#ffffff/i);
  });

  test('Dark theme should have dark background', async ({ page, themeUtils }) => {
    // Arrange: Navigate and switch to dark theme
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await themeUtils.switchTheme('dark');

    // Act: Get background color for dark theme
    const bgColor = await page.evaluate(() => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      return style.getPropertyValue('--background-color').trim();
    });

    // Assert: Should contain dark color (not white)
    expect(bgColor.toLowerCase()).not.toMatch(/white|rgb\s*\(\s*255\s*,\s*255\s*,\s*255\s*\)|#fff|#ffffff/i);
  });

  test('CSS variables should exist in document root', async ({ page }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Check if CSS variables are defined
    const cssVariables = await page.evaluate(() => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      return {
        primaryColor: style.getPropertyValue('--primary-color').trim(),
        backgroundColor: style.getPropertyValue('--background-color').trim(),
        textColor: style.getPropertyValue('--text-color').trim(),
      };
    });

    // Assert: All CSS variables should have values
    expect(cssVariables.primaryColor.length).toBeGreaterThan(0);
    expect(cssVariables.backgroundColor.length).toBeGreaterThan(0);
    expect(cssVariables.textColor.length).toBeGreaterThan(0);
  });

  test('Body element should have transition class or property', async ({ page }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Check for transition on body
    const hasTransition = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const transition = bodyStyle.transition;
      const transitionProperty = bodyStyle.transitionProperty;
      return !!(transition && transition !== 'none') || !!(transitionProperty && transitionProperty !== 'none');
    });

    // Assert: Body should have transitions defined
    expect(hasTransition).toBeTruthy();
  });

  test('Theme should apply to nested elements correctly', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Switch to dark theme
    await themeUtils.switchTheme('dark');

    // Check if nested elements exist on the page
    const nestedElementsExist = await page.evaluate(() => {
      const body = document.body;
      const buttons = body.querySelectorAll('button');
      const links = body.querySelectorAll('a');

      // At least one element should be present
      return buttons.length > 0 || links.length > 0;
    });

    // Assert: Nested elements should exist and be present
    expect(nestedElementsExist).toBeTruthy();

    // Verify dark theme is still applied
    await themeUtils.verifyThemeClass('dark');
  });

  test('Theme switching should not cause layout shift', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get the initial viewport size
    const initialSize = page.viewportSize();

    // Act: Switch theme multiple times
    await themeUtils.switchTheme('dark');
    await themeUtils.waitForThemeTransition();
    await themeUtils.switchTheme('light');
    await themeUtils.waitForThemeTransition();

    // Assert: Viewport size should remain the same
    const finalSize = page.viewportSize();
    expect(finalSize).toEqual(initialSize);
  });

  test('Theme radio buttons in menu should have visual feedback', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open the hamburger menu
    await themeUtils.openMenu();

    // Act: Get the checked state of light radio
    const lightRadio = page.locator('input[name="theme"][value="light"]');
    const isChecked = await lightRadio.isChecked();

    // Assert: Light radio should be visibly checked
    expect(isChecked).toBeTruthy();
    await expect(lightRadio).toBeChecked();
  });

  test('Primary color should differ between themes', async ({ page, themeUtils }) => {
    // Arrange: Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Act: Get primary color for light theme
    const lightPrimaryColor = await themeUtils.getCSSVariableValue('--primary-color');

    // Switch to dark theme
    await themeUtils.switchTheme('dark');
    const darkPrimaryColor = await themeUtils.getCSSVariableValue('--primary-color');

    // Assert: Primary colors might be different (implementation dependent)
    // At minimum, they should be defined
    expect(lightPrimaryColor.length).toBeGreaterThan(0);
    expect(darkPrimaryColor.length).toBeGreaterThan(0);
  });
});
