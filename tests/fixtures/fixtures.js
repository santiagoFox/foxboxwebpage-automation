const { test: base } = require('@playwright/test');
const HomePage = require('../pages/home.page');
const AiAssessmentPage = require('../pages/ai-assessment.page');
const AboutPage = require('../pages/about.page');
const BlogPage = require('../pages/blog.page');
const CaseStudiesPage = require('../pages/case-studies.page');
const ContactPage = require('../pages/contact.page');
const ProductLabPage = require('../pages/product-lab.page');
const ProductMaintenancePage = require('../pages/product-maintenance.page');
const StaffAugmentationPage = require('../pages/staff-augmentation.page');
const ApproachPage = require('../pages/approach.page');
const CulturePage = require('../pages/culture.page');
const PrivacyPage = require('../pages/privacy.page');

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

  contactPageAllCookies: async ({ page }, use) => {
    const contactPage = new ContactPage(page);
    await contactPage.open();
    await contactPage.acceptAllCookies();
    await use(contactPage);
  },

  contactPageEssentialCookies: async ({ page }, use) => {
    const contactPage = new ContactPage(page);
    await contactPage.open();
    await contactPage.acceptEssentialCookies();
    await use(contactPage);
  },

  productLabPage: async ({ page }, use) => {
    const productLabPage = new ProductLabPage(page);
    await productLabPage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(productLabPage);
  },

  productMaintenancePage: async ({ page }, use) => {
    const productMaintenancePage = new ProductMaintenancePage(page);
    await productMaintenancePage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(productMaintenancePage);
  },

  staffAugmentationPage: async ({ page }, use) => {
    const staffAugmentationPage = new StaffAugmentationPage(page);
    await staffAugmentationPage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(staffAugmentationPage);
  },

  approachPage: async ({ page }, use) => {
    const approachPage = new ApproachPage(page);
    await approachPage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(approachPage);
  },

  culturePage: async ({ page }, use) => {
    const culturePage = new CulturePage(page);
    await culturePage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(culturePage);
  },

  privacyPage: async ({ page }, use) => {
    const privacyPage = new PrivacyPage(page);
    await privacyPage.open();
    await page.addStyleTag({ content: iframeStyle });
    await use(privacyPage);
  },

  aiAssessmentPage: async ({ page }, use) => {
    const assessmentPage = new AiAssessmentPage(page);
    await assessmentPage.open();
    await assessmentPage.dismissCookieBanner();
    await use(assessmentPage);
  },
});

module.exports = { test };
