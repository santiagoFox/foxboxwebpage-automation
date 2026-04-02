const { test: base } = require('@playwright/test');
const HomePage = require('../pages/home.page');

const test = base.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    // Disable pointer events on the Intercom chat overlay after page load.
    // When scrolled to the services section, the overlay iframe sits on top of the
    // accordion elements and intercepts pointer events, blocking clicks.
    await page.addStyleTag({ content: 'iframe { pointer-events: none !important; }' });
    await use(homePage);
  },
});

module.exports = { test };
