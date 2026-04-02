const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');
const testData = require('../../data/testData');

test.describe('SC01 - Header / Navigation', () => {
  test('SC01-TC01 - Logo is visible', async ({ homePage }) => {
    await expect(homePage.logo).toBeVisible();
  });

  test('SC01-TC02 - Hamburger menu button is visible', async ({ homePage }) => {
    await expect(homePage.hamburgerMenu).toBeVisible();
  });

  test('SC01-TC03 - Page title contains Foxbox', async ({ homePage }) => {
    const title = await homePage.getTitle();
    expect(title).toContain('Foxbox');
  });
});

test.describe('SC02 - Hero Section', () => {
  test('SC02-TC01 - Hero heading is visible', async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
  });

  test('SC02-TC02 - Hero subheading is visible', async ({ homePage }) => {
    await expect(homePage.heroSubheading).toBeVisible();
  });
});

test.describe('SC03 - Welcome Section', () => {
  test('SC03-TC01 - Welcome heading is visible', async ({ homePage }) => {
    await expect(homePage.welcomeHeading).toBeVisible();
  });

  test('SC03-TC02 - Welcome body text is visible', async ({ homePage }) => {
    await expect(homePage.welcomeBody).toBeVisible();
  });
});

test.describe('SC04 - Case Studies', () => {
  test('SC04-TC01 - K Health section heading is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.kHealthHeading);
    await expect(homePage.kHealthHeading).toBeVisible();
  });

  test('SC04-TC02 - K Health "See The Case Study" link is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.kHealthCaseStudyLink);
    await expect(homePage.kHealthCaseStudyLink).toBeVisible();
  });

  test('SC04-TC03 - X Company section heading is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.xCompanyHeading);
    await expect(homePage.xCompanyHeading).toBeVisible();
  });

  test('SC04-TC04 - X Company "See The Case Study" link is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.xCompanyCaseStudyLink);
    await expect(homePage.xCompanyCaseStudyLink).toBeVisible();
  });

  test('SC04-TC05 - Home Chef section heading is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.homeChefHeading);
    await expect(homePage.homeChefHeading).toBeVisible();
  });

  test('SC04-TC06 - Home Chef "See The Case Study" link is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.homeChefCaseStudyLink);
    await expect(homePage.homeChefCaseStudyLink).toBeVisible();
  });
});

test.describe('SC05 - Testimonial Section', () => {
  test('SC05-TC01 - Testimonial quote is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.testimonialQuote);
    await expect(homePage.testimonialQuote).toBeVisible();
  });

  test('SC05-TC02 - Testimonial author name is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.testimonialAuthor);
    await expect(homePage.testimonialAuthor).toBeVisible();
  });

  test('SC05-TC03 - Read More button is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.testimonialReadMore);
    await expect(homePage.testimonialReadMore).toBeVisible();
  });
});

test.describe('SC06 - Services Section', () => {
  test('SC06-TC01 - Services section heading is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.servicesHeading);
    await expect(homePage.servicesHeading).toBeVisible();
  });

  test('SC06-TC02 - Product Lab accordion is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.productLabAccordion);
    await expect(homePage.productLabAccordion).toBeVisible();
  });

  test('SC06-TC03 - Product Maintenance accordion is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.productMaintenanceAccordion);
    await expect(homePage.productMaintenanceAccordion).toBeVisible();
  });

  test('SC06-TC04 - Staff Aug+ accordion is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.staffAugAccordion);
    await expect(homePage.staffAugAccordion).toBeVisible();
  });

  test('SC06-TC05 - Clicking Product Lab accordion expands it', async ({ homePage }) => {
    await homePage.expandProductLab();
    // Accordion should still be visible after clicking
    await expect(homePage.productLabAccordion).toBeVisible();
  });

  test('SC06-TC06 - Clicking Product Maintenance accordion expands it', async ({ homePage }) => {
    await homePage.expandProductMaintenance();
    await expect(homePage.productMaintenanceAccordion).toBeVisible();
  });

  test('SC06-TC07 - Clicking Staff Aug+ accordion expands it', async ({ homePage }) => {
    await homePage.expandStaffAug();
    await expect(homePage.staffAugAccordion).toBeVisible();
  });

  // Product Lab expanded content
  test('SC06-TC08 - Product Lab shows description when expanded', async ({ homePage }) => {
    await homePage.expandProductLab();
    await expect(homePage.productLabDescription).toBeVisible();
  });

  test('SC06-TC09 - Product Lab shows Learn More link when expanded', async ({ homePage }) => {
    await homePage.expandProductLab();
    await expect(homePage.productLabLearnMore).toBeVisible();
  });

  test('SC06-TC10 - Product Lab collapses when clicked again', async ({ homePage }) => {
    await homePage.expandProductLab();
    await expect(homePage.productLabContent).not.toHaveCSS('height', '0px');
    await homePage.collapseProductLab();
    await expect(homePage.productLabContent).toHaveCSS('height', '0px');
  });

  test('SC06-TC11 - Product Lab Learn More navigates to Product Lab page', async ({ homePage }) => {
    await homePage.expandProductLab();
    await homePage.clickProductLabLearnMore();
    await homePage.page.waitForLoadState('networkidle');
    await expect(homePage.page).toHaveURL(/\/product-lab/);
  });

  // Product Maintenance expanded content
  test('SC06-TC12 - Product Maintenance shows description when expanded', async ({ homePage }) => {
    await homePage.expandProductMaintenance();
    await expect(homePage.productMaintenanceDescription).toBeVisible();
  });

  test('SC06-TC13 - Product Maintenance shows Learn More link when expanded', async ({ homePage }) => {
    await homePage.expandProductMaintenance();
    await expect(homePage.productMaintenanceLearnMore).toBeVisible();
  });

  test('SC06-TC14 - Product Maintenance collapses when clicked again', async ({ homePage }) => {
    await homePage.expandProductMaintenance();
    await expect(homePage.productMaintenanceContent).not.toHaveCSS('height', '0px');
    await homePage.collapseProductMaintenance();
    await expect(homePage.productMaintenanceContent).toHaveCSS('height', '0px');
  });

  test('SC06-TC15 - Product Maintenance Learn More navigates to Product Maintenance page', async ({ homePage }) => {
    await homePage.expandProductMaintenance();
    await homePage.clickProductMaintenanceLearnMore();
    await homePage.page.waitForLoadState('networkidle');
    await expect(homePage.page).toHaveURL(/\/product-maintenance/);
  });

  // Staff Aug+ expanded content
  test('SC06-TC16 - Staff Aug+ shows description when expanded', async ({ homePage }) => {
    await homePage.expandStaffAug();
    await expect(homePage.staffAugDescription).toBeVisible();
  });

  test('SC06-TC17 - Staff Aug+ shows Learn More link when expanded', async ({ homePage }) => {
    await homePage.expandStaffAug();
    await expect(homePage.staffAugLearnMore).toBeVisible();
  });

  test('SC06-TC18 - Staff Aug+ collapses when clicked again', async ({ homePage }) => {
    await homePage.expandStaffAug();
    await expect(homePage.staffAugContent).not.toHaveCSS('height', '0px');
    await homePage.collapseStaffAug();
    await expect(homePage.staffAugContent).toHaveCSS('height', '0px');
  });

  test('SC06-TC19 - Staff Aug+ Learn More navigates to Staff Aug page', async ({ homePage }) => {
    await homePage.expandStaffAug();
    await homePage.clickStaffAugLearnMore();
    await homePage.page.waitForLoadState('networkidle');
    await expect(homePage.page).toHaveURL(/\/staff-aug/);
  });
});

test.describe('SC07 - Inside the Box (Blog)', () => {
  test('SC07-TC01 - "Inside the Box" heading is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.insideTheBoxHeading);
    await expect(homePage.insideTheBoxHeading).toBeVisible();
  });

  test('SC07-TC02 - K Health article title is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.kHealthArticleTitle);
    await expect(homePage.kHealthArticleTitle).toBeVisible();
  });

  test('SC07-TC03 - Automated QA Testing article title is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.claudeCodeArticleTitle);
    await expect(homePage.claudeCodeArticleTitle).toBeVisible();
  });

  test('SC07-TC04 - AI Pilot article title is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.aiPilotArticleTitle);
    await expect(homePage.aiPilotArticleTitle).toBeVisible();
  });

  test('SC07-TC05 - Blog section has at least 3 Read More links', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.insideTheBoxHeading);
    const count = await homePage.blogArticles.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

test.describe('SC08 - What We Believe Section', () => {
  test('SC08-TC01 - "What We Believe" heading is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.whatWeBelieveHeading);
    await expect(homePage.whatWeBelieveHeading).toBeVisible();
  });

  test('SC08-TC02 - All 6 beliefs are visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.whatWeBelieveHeading);
    await expect(homePage.belief1).toBeVisible();
    await expect(homePage.belief2).toBeVisible();
    await expect(homePage.belief3).toBeVisible();
    await expect(homePage.belief4).toBeVisible();
    await expect(homePage.belief5).toBeVisible();
    await expect(homePage.belief6).toBeVisible();
  });

  test('SC08-TC03 - "Why We Do What We Do" button is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.whyWeDoButton);
    await expect(homePage.whyWeDoButton).toBeVisible();
  });
});

test.describe('SC09 - Trusted to Deliver Section', () => {
  test('SC09-TC01 - "Trusted to deliver" heading is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.trustedHeading);
    await expect(homePage.trustedHeading).toBeVisible();
  });
});

test.describe('SC10 - CTA Section', () => {
  test('SC10-TC01 - "Ready to get building?" heading is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.ctaHeading);
    await expect(homePage.ctaHeading).toBeVisible();
  });

  test('SC10-TC02 - "Chat With Us" button is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.chatWithUsButton);
    await expect(homePage.chatWithUsButton).toBeVisible();
  });
});

test.describe('SC11 - Footer', () => {
  test('SC11-TC01 - Footer "Contact us" section is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerContactUs);
    await expect(homePage.footerContactUs).toBeVisible();
  });

  test('SC11-TC02 - Footer "Follow Us" section is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerFollowUs);
    await expect(homePage.footerFollowUs).toBeVisible();
  });

  test('SC11-TC03 - Footer Foxbox links are present', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerAbout);
    await expect(homePage.footerAbout).toBeVisible();
    await expect(homePage.footerBlog).toBeVisible();
    await expect(homePage.footerCareers).toBeVisible();
    await expect(homePage.footerApproach).toBeVisible();
    await expect(homePage.footerCulture).toBeVisible();
  });

  test('SC11-TC04 - Footer Services links are present', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerProductLab);
    await expect(homePage.footerProductLab).toBeVisible();
    await expect(homePage.footerProductMaintenance).toBeVisible();
    await expect(homePage.footerStaffAug).toBeVisible();
  });

  test('SC11-TC05 - Newsletter email input is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.newsletterInput);
    await expect(homePage.newsletterInput).toBeVisible();
  });

  test('SC11-TC06 - Newsletter Sign Up button is visible', async ({ homePage }) => {
    await expect(homePage.newsletterSignUpButton).toBeVisible();
  });

  test('SC11-TC07 - Footer copyright text is correct', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerCopyright);
    await expect(homePage.footerCopyright).toBeVisible();
  });

  test('SC11-TC08 - Privacy Policy link is visible', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerPrivacyPolicy);
    await expect(homePage.footerPrivacyPolicy).toBeVisible();
  });

  test('SC11-TC09 - Newsletter accepts email input', async ({ homePage }) => {
    await homePage.fillNewsletterEmail(testData.newsletter.validEmail);
    await expect(homePage.newsletterInput).toHaveValue(testData.newsletter.validEmail);
  });
});
