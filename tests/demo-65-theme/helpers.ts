import { Page } from '@playwright/test';

/**
 * Helper functions for theme testing
 */

/**
 * Wait for a specific theme class to be present on the body element
 */
export async function waitForThemeClass(page: Page, theme: 'light' | 'dark', timeout = 5000) {
  const themeClass = `theme-${theme}`;
  await page.locator(`body:has-text("")`).evaluate(
    (element, className) => {
      return new Promise<void>((resolve) => {
        const checkClass = () => {
          if (element.classList.contains(className)) {
            resolve();
          } else {
            setTimeout(checkClass, 100);
          }
        };
        checkClass();
      });
    },
    themeClass
  );
}

/**
 * Get the current theme without using utilities
 */
export async function getCurrentThemeFromDOM(page: Page): Promise<'light' | 'dark' | 'unknown'> {
  const bodyClass = await page.locator('body').getAttribute('class');
  if (bodyClass?.includes('theme-dark')) return 'dark';
  if (bodyClass?.includes('theme-light')) return 'light';
  return 'unknown';
}

/**
 * Get all CSS custom properties for a given theme
 */
export async function getThemeCSSVariables(page: Page) {
  return await page.evaluate(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    return {
      primaryColor: style.getPropertyValue('--primary-color').trim(),
      backgroundColor: style.getPropertyValue('--background-color').trim(),
      textColor: style.getPropertyValue('--text-color').trim(),
      accentColor: style.getPropertyValue('--accent-color').trim() || 'not set',
    };
  });
}

/**
 * Take a screenshot comparison between themes
 */
export async function compareThemeScreenshots(
  page: Page,
  testName: string
): Promise<{ light: string; dark: string }> {
  // Navigate to home and ensure light theme
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const lightScreenshot = await page.screenshot();

  // Switch to dark theme
  const darkRadio = page.locator('input[type="radio"][value="dark"]');
  await darkRadio.check();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400); // Wait for transition

  const darkScreenshot = await page.screenshot();

  return {
    light: Buffer.from(lightScreenshot).toString('base64'),
    dark: Buffer.from(darkScreenshot).toString('base64'),
  };
}

/**
 * Verify that the AJAX request was sent to the server
 */
export async function verifyThemeAjaxRequest(page: Page, expectedTheme: 'light' | 'dark') {
  let requestFound = false;

  page.on('response', (response) => {
    if (response.url().includes('set-theme.php')) {
      requestFound = true;
    }
  });

  const radioSelector = `input[type="radio"][value="${expectedTheme}"]`;
  await page.locator(radioSelector).check();
  await page.waitForLoadState('networkidle');

  return requestFound;
}

/**
 * Get the theme from session storage or other storage mechanism
 */
export async function getStoredThemeValue(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    // Check session storage
    const sessionTheme = sessionStorage.getItem('theme');
    if (sessionTheme) return sessionTheme;

    // Check local storage
    const localTheme = localStorage.getItem('theme');
    if (localTheme) return localTheme;

    // Check cookies
    const cookies = document.cookie;
    const themeMatch = cookies.match(/theme=([^;]*)/);
    if (themeMatch) return themeMatch[1];

    return null;
  });
}

/**
 * Simulate a user interaction with theme switching
 */
export async function interactiveThemeSwitch(page: Page, targetTheme: 'light' | 'dark') {
  const radioSelector = `input[type="radio"][value="${targetTheme}"]`;
  const radio = page.locator(radioSelector);

  // Hover over the radio button
  await radio.hover();

  // Click the radio button
  await radio.click();

  // Wait for the theme change to be applied
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400); // Wait for CSS transition
}

/**
 * Perform accessibility check for theme switching
 */
export async function checkThemeAccessibility(page: Page) {
  const lightRadio = page.locator('input[type="radio"][value="light"]');
  const darkRadio = page.locator('input[type="radio"][value="dark"]');

  const lightLabel = lightRadio.locator('..').locator('label');
  const darkLabel = darkRadio.locator('..').locator('label');

  return {
    lightRadioAccessible: await lightRadio.isVisible(),
    lightRadioAccessibleViaKeyboard: await lightRadio.isEnabled(),
    darkRadioAccessible: await darkRadio.isVisible(),
    darkRadioAccessibleViaKeyboard: await darkRadio.isEnabled(),
  };
}
