const { test: base } = require('@playwright/test');
const HomePage = require('../pages/home.page');
const AboutPage = require('../pages/about.page');
const BlogPage = require('../pages/blog.page');
const CaseStudiesPage = require('../pages/case-studies.page');

const iframeStyle = 'iframe { pointer-events: none !important; }';

const test = base.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    // Disable pointer events on the Intercom chat overlay after page load.
    // When scrolled to the services section, the overlay iframe sits on top of the
    // accordion elements and intercepts pointer events, blocking clicks.
    await page.addStyleTag({ content: iframeStyle });
    await use(homePage);
  },

  aboutPage: async ({ page }, use) => {
    const aboutPage = new AboutPage(page);
    await aboutPage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(aboutPage);
  },

  blogPage: async ({ page }, use) => {
    const blogPage = new BlogPage(page);
    await blogPage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(blogPage);
  },

  caseStudiesPage: async ({ page }, use) => {
    const caseStudiesPage = new CaseStudiesPage(page);
    await caseStudiesPage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(caseStudiesPage);
  },
});

module.exports = { test };
