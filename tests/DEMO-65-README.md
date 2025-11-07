# DEMO-65: Theme Management - Automated Tests with Playwright

This directory contains comprehensive Playwright automation tests for the DEMO-65 user story: Theme Management system.

## Overview

The DEMO-65 theme management system allows users to switch between light and dark themes via the hamburger menu (top right corner). These tests verify:

- **Default Light Theme**: Light theme is applied by default on initial load
- **Theme Switching**: Users can switch between light and dark themes through the hamburger menu instantly
- **Theme Persistence**: Theme preferences persist during the session
- **Visual Styles & Transitions**: CSS transitions and theme colors are correctly applied

### Application URL and Theme Selector Location

- **Base URL**: `https://localhost:8443`
- **Theme Selector Location**: Hamburger menu button in top right corner (hamburger icon ☰)
- **Menu Structure**: Theme selector is at the bottom of the sidebar navigation (below login/logout links)

## Test Structure

```
tests/
├── demo-65-theme/
│   ├── 01-default-light-theme.spec.ts    # Default light theme tests
│   ├── 02-theme-switching.spec.ts        # Theme switching functionality tests
│   ├── 03-theme-persistence.spec.ts      # Session persistence tests
│   ├── 04-theme-visual-styles.spec.ts    # CSS and visual style tests
│   └── helpers.ts                        # Test utility functions
├── fixtures.ts                            # Custom test fixtures
└── DEMO-65-README.md                      # This file
```

## Setup

### Prerequisites

- Node.js 16+ and npm
- Docker and Docker Compose (for running the application)
- The CURA application running on `https://localhost:8443`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure the application is running:
   ```bash
   docker-compose up
   ```

   The application will be available at `https://localhost:8443`

## Running Tests

### Desktop Browsers Only (Chrome & Firefox)

The configuration supports only desktop browsers (Chrome and Firefox). Mobile browsers have been excluded.

### Run All DEMO-65 Tests (Desktop - Chrome & Firefox)

```bash
npm run test:demo-65
```

This runs all DEMO-65 tests on both Chrome and Firefox.

### Run DEMO-65 Tests on Chrome Only

```bash
npm run test:demo-65:chrome
```

### Run DEMO-65 Tests on Firefox Only

```bash
npm run test:demo-65:firefox
```

### Run DEMO-65 Tests in Headed Mode (Visible Browser)

```bash
# Both Chrome and Firefox (headed)
npm run test:demo-65:headed

# Chrome only (headed)
npm run test:demo-65:chrome:headed

# Firefox only (headed)
npm run test:demo-65:firefox:headed
```

Tests will run with visible browser windows so you can watch the automation.

### Run DEMO-65 Tests with UI Mode (Interactive)

```bash
npm run test:demo-65:ui
```

This opens the Playwright Inspector UI where you can run tests interactively on both browsers.

### Run DEMO-65 Tests in Debug Mode

```bash
npm run test:demo-65:debug
```

This starts the Playwright Inspector which lets you step through tests line by line.

### Run All Tests (All User Stories, All Browsers)

```bash
npm test
```

### Run All Tests on Specific Browser

```bash
# All tests on Chrome
npm run test:chrome

# All tests on Chrome (headed)
npm run test:chrome:headed

# All tests on Firefox
npm run test:firefox

# All tests on Firefox (headed)
npm run test:firefox:headed
```

### View Test Report

After running tests, view the HTML report:

```bash
npm run test:report
```

This opens an interactive HTML report showing test results, screenshots, and videos.

## Test Files Explained

### 01-default-light-theme.spec.ts

Tests that verify the light theme is the default:

- Light theme applied by default on first load
- Light theme radio button is selected in hamburger menu
- Body element has `theme-light` class
- CSS variables for light theme are applied
- Theme selector is visible and accessible in hamburger menu
- Hamburger menu toggle button is visible and functional

**Key Assertions:**
- `body` contains `theme-light` class
- Light theme radio button is checked
- Theme form is visible in hamburger menu
- Both light and dark radio buttons are present in menu

### 02-theme-switching.spec.ts

Tests that verify users can switch between themes via the hamburger menu:

- Switch from light to dark theme via hamburger menu
- Switch from dark back to light theme via hamburger menu
- Radio buttons in menu reflect the current theme
- Theme applies immediately without page reload
- CSS variables are updated for the new theme
- Multiple rapid switches work correctly
- Menu automatically closes after theme selection

**Key Assertions:**
- Theme class changes on body element
- Correct radio button is checked in menu
- No page reload occurs during switching
- CSS variables reflect the new theme
- Menu is closed after theme switch

### 03-theme-persistence.spec.ts

Tests that verify theme preferences are maintained:

- Theme persists during the session
- Theme remains after navigating to other pages
- AJAX request is sent to `set-theme.php`
- Multiple theme switches maintain correct state
- Theme state in session storage is consistent

**Key Assertions:**
- Theme class is consistent across page navigations
- AJAX requests are made to the server
- Session storage contains the theme value

### 04-theme-visual-styles.spec.ts

Tests that verify CSS styling and transitions:

- CSS transitions are smooth (0.3s)
- Background colors differ between themes
- Text colors differ between themes
- CSS variables are properly defined
- Theme switching doesn't cause layout shift
- Radio buttons have visual feedback
- Primary colors are theme-appropriate

**Key Assertions:**
- Transition duration is set to 0.3s
- CSS variables have valid color values
- Theme colors are distinct between light and dark
- No viewport size changes during theme switching

## Custom Fixtures

The test suite uses custom Playwright fixtures defined in `fixtures.ts`:

### `themeUtils` Fixture

Provides utility functions for theme testing with hamburger menu interaction:

```typescript
// Menu Management
themeUtils.openMenu()               // Open the hamburger menu
themeUtils.closeMenu()              // Close the hamburger menu
themeUtils.isMenuOpen()             // Check if menu is currently visible

// Theme Management
themeUtils.getCurrentTheme()        // Get current theme ('light' or 'dark')
themeUtils.getStoredTheme()         // Get theme from storage
themeUtils.switchTheme('dark')      // Switch to a specific theme (opens menu, selects, closes)
themeUtils.verifyThemeClass('dark') // Assert theme class on body
themeUtils.verifyCSSVariables('dark') // Assert CSS variables are set
themeUtils.waitForThemeTransition() // Wait for CSS transition to complete (0.3s)
themeUtils.getCSSVariableValue('--primary-color') // Get CSS variable value
```

### Usage Example

```typescript
test('User can switch to dark theme via hamburger menu', async ({ page, themeUtils }) => {
  await page.goto('/');

  // Switch theme using the utility (automatically handles menu open/close)
  await themeUtils.switchTheme('dark');

  // Verify it was applied
  await themeUtils.verifyThemeClass('dark');
});

// Or manually control the menu:
test('Manual menu control example', async ({ page, themeUtils }) => {
  await page.goto('/');

  // Manually open menu
  await themeUtils.openMenu();

  // Verify theme selector is visible
  const themeForm = page.locator('#theme-form');
  await expect(themeForm).toBeVisible();

  // Manually close menu
  await themeUtils.closeMenu();
});
```

## Test Configuration

### playwright.config.ts

Key configuration settings:

- **Base URL**: `https://localhost:8443` (with self-signed certificate)
- **Test Directory**: `./tests`
- **Browsers**: Chromium (Chrome), Firefox (Desktop only)
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Recorded on first retry
- **Web Server**: Docker Compose with auto-start
- **HTTPS Errors**: Ignored (for self-signed certificate support)

**Note**: Mobile browsers and Safari (WebKit) have been disabled. Only desktop Chrome and Firefox are tested.

## Helper Functions

Additional helper functions are available in `tests/demo-65-theme/helpers.ts`:

- `getCurrentThemeFromDOM()` - Get theme without fixtures
- `getThemeCSSVariables()` - Get all CSS custom property values
- `compareThemeScreenshots()` - Compare visual appearance between themes
- `verifyThemeAjaxRequest()` - Verify server communication
- `interactiveThemeSwitch()` - Simulate realistic user interactions
- `checkThemeAccessibility()` - Verify keyboard/accessibility support

## Continuous Integration

For CI/CD pipelines, run tests like this:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Generate HTML report
npm run test:report
```

The tests are configured to:
- Run with retries (2 retries on CI)
- Run sequentially on CI (no parallel workers)
- Capture artifacts (screenshots, videos, traces) on failure
- Generate an HTML report

## Troubleshooting

### Tests fail with "Connection refused"

**Problem**: Application is not running

**Solution**: Start the application with Docker:
```bash
docker-compose up
```

### Tests fail with "Certificate error"

**Problem**: Self-signed certificate is not trusted

**Solution**: The configuration already ignores HTTPS errors. If still failing, ensure:
```bash
docker-compose up
```

And the application is fully running before starting tests.

### Tests timeout waiting for network idle

**Problem**: Application is slow to load

**Solution**: Increase timeout in playwright.config.ts or specific tests:
```typescript
await page.goto('/', { waitUntil: 'domcontentloaded' });
```

### Theme changes not detected

**Problem**: Test runs too fast before theme updates

**Solution**: Tests use `waitForLoadState('networkidle')` and `waitForThemeTransition()` which should handle this. Check if:
1. AJAX endpoint is responding: `curl https://localhost:8443/set-theme.php`
2. JavaScript is enabled in the test browser
3. Console for any JavaScript errors

### Menu not opening

**Problem**: Hamburger menu fails to open

**Solution**: Ensure:
1. The menu toggle button ID is `#menu-toggle`
2. The menu container ID is `#sidebar-wrapper`
3. The `active` class is used to show/hide the menu
4. Check browser console for JavaScript errors in theme.js

### Tests fail on Firefox or Chrome specifically

**Problem**: Browser-specific issues

**Solution**:
1. Run tests in headed mode to observe behavior: `npm run test:demo-65:firefox:headed`
2. Run with UI mode for interactive debugging: `npm run test:demo-65:ui`
3. Check that both browsers have the same viewport size

## Test Statistics

- **Total Tests**: 45+ test cases across 4 spec files
- **Browsers Tested**: 2 (Chromium/Chrome, Firefox) - Desktop only
- **Coverage Areas**:
  - UI Interactions & Menu (8 tests)
  - Theme Switching (9 tests)
  - Session Persistence (9 tests)
  - Visual Styling (12 tests)

- **Total Test Runs Per Suite**: Tests run on both Chrome and Firefox sequentially
- **Artifacts**: Screenshots, videos, and traces on failures

## CI/CD Integration

### GitHub Actions Example

```yaml
name: DEMO-65 Theme Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      docker:
        image: docker:latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: docker-compose up -d
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [CURA Application Documentation](../README.md)
- [Theme Implementation Details](../IMPLEMENTATION_SUMMARY.md)

## Contributing

When adding new tests:

1. Follow the naming convention: `NN-test-description.spec.ts`
2. Use the `themeUtils` fixture for common operations
3. Add descriptive comments explaining what the test verifies
4. Include both positive and negative test cases
5. Update this README if adding new test suites

## Test Maintenance

- Tests should be run before each commit to `master`
- HTML reports should be reviewed for any failures or visual changes
- Update tests when theme implementation changes
- Keep helper functions and fixtures in sync with test requirements
