// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/specs',
  timeout: 60000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  retries: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
  ],
  use: {
    // Canonical host is the apex (FOX2-155, landed 2026-08-05); www 308s to it.
    // The suite must originate from the apex so relative navigations and redirect
    // assertions capture the real hop (e.g. /blog -> /case-studies) instead of the
    // www->apex canonicalisation hop that fires first when requesting via www.
    baseURL: 'https://foxbox.com',
    headless: true,
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
