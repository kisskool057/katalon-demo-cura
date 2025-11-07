import { test as base, Page, expect } from '@playwright/test';

/**
 * Custom fixture for theme testing
 * Provides utility functions to test theme functionality
 */
export type ThemeTestFixture = {
  themeUtils: {
    /**
     * Get the current theme applied to the page
     */
    getCurrentTheme: () => Promise<string>;

    /**
     * Get the theme from session (via localStorage or cookies)
     */
    getStoredTheme: () => Promise<string | null>;

    /**
     * Switch theme by clicking the radio button
     */
    switchTheme: (theme: 'light' | 'dark') => Promise<void>;

    /**
     * Verify the theme is applied to the body element
     */
    verifyThemeClass: (expectedTheme: 'light' | 'dark') => Promise<void>;

    /**
     * Verify CSS variables are set correctly for the theme
     */
    verifyCSSVariables: (theme: 'light' | 'dark') => Promise<void>;

    /**
     * Wait for theme transition to complete
     */
    waitForThemeTransition: () => Promise<void>;

    /**
     * Get computed style value for a CSS variable
     */
    getCSSVariableValue: (variableName: string) => Promise<string>;
  };
};

export const test = base.extend<ThemeTestFixture>({
  themeUtils: async ({ page }, use) => {
    const themeUtils = {
      /**
       * Open the hamburger menu to access theme selector
       */
      openMenu: async () => {
        const menuToggle = page.locator('#menu-toggle');
        await menuToggle.click();
        // Wait for menu animation to complete
        await page.waitForTimeout(300);
      },

      /**
       * Close the hamburger menu
       */
      closeMenu: async () => {
        const menuClose = page.locator('#menu-close');
        await menuClose.click();
        // Wait for menu animation to complete
        await page.waitForTimeout(300);
      },

      /**
       * Check if the menu is currently visible
       */
      isMenuOpen: async () => {
        const sidebar = page.locator('#sidebar-wrapper');
        return await sidebar.evaluate((el) => {
          return el.classList.contains('active');
        });
      },

      getCurrentTheme: async () => {
        const bodyClass = await page.locator('body').getAttribute('class');
        if (bodyClass?.includes('theme-dark')) return 'dark';
        if (bodyClass?.includes('theme-light')) return 'light';
        return 'unknown';
      },

      getStoredTheme: async () => {
        return await page.evaluate(() => {
          // Check if theme is stored in sessionStorage
          return sessionStorage.getItem('theme');
        });
      },

      switchTheme: async (theme: 'light' | 'dark') => {
        // Open the menu if it's not already open
        const isOpen = await themeUtils.isMenuOpen();
        if (!isOpen) {
          await themeUtils.openMenu();
        }

        // Click the radio button for the desired theme
        const radioSelector = `input[name="theme"][value="${theme}"]`;
        await page.locator(radioSelector).check();

        // Wait for AJAX request to complete
        await page.waitForLoadState('networkidle');

        // Close the menu after switching
        await themeUtils.closeMenu();
      },

      verifyThemeClass: async (expectedTheme: 'light' | 'dark') => {
        const expectedClass = `theme-${expectedTheme}`;
        const bodyElement = page.locator('body');
        const classes = await bodyElement.getAttribute('class');
        expect(classes).toContain(expectedClass);
      },

      verifyCSSVariables: async (theme: 'light' | 'dark') => {
        // Verify that CSS variables are set (actual values depend on implementation)
        const variables = {
          light: {
            '--primary-color': true,
            '--background-color': true,
            '--text-color': true,
          },
          dark: {
            '--primary-color': true,
            '--background-color': true,
            '--text-color': true,
          },
        };

        const expectedVars = variables[theme];
        for (const varName of Object.keys(expectedVars)) {
          const actualValue = await page.evaluate(
            (name) => {
              return getComputedStyle(document.documentElement)
                .getPropertyValue(name)
                .trim();
            },
            varName
          );
          // Just verify that the variable is defined and has a value
          expect(actualValue.length).toBeGreaterThan(0);
        }
      },

      waitForThemeTransition: async () => {
        // CSS transition is 0.3s, wait for it plus some buffer
        await page.waitForTimeout(400);
      },

      getCSSVariableValue: async (variableName: string) => {
        return await page.evaluate((name) => {
          return getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        }, variableName);
      },
    };

    await use(themeUtils);
  },
});

export { expect };
