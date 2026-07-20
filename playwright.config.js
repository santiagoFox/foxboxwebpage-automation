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
    baseURL: 'https://www.foxbox.com',
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
