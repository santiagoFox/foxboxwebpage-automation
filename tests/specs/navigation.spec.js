const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC12 - Navigation Menu - Open / Close', () => {
  test('SC12-TC01 - Hamburger menu opens and shows all navigation links', async ({ homePage }) => {
    await homePage.openNavMenu();
    // Verify key links from each section are visible
    await expect(homePage.navAboutUs).toBeVisible();
    await expect(homePage.navProductLab).toBeVisible();
    await expect(homePage.navSeeAllCaseStudies).toBeVisible();
  });

  test('SC12-TC02 - Menu closes when Escape key is pressed', async ({ homePage }) => {
    await homePage.openNavMenu();
    await expect(homePage.navAboutUs).toBeVisible();
    await homePage.page.keyboard.press('Escape');
    await homePage.page.waitForTimeout(400);
    await expect(homePage.navAboutUs).not.toBeVisible();
  });

  test('SC12-TC03 - "LET\'S CHAT" button is visible in the menu', async ({ homePage }) => {
    await homePage.openNavMenu();
    await expect(homePage.navLetsChatButton).toBeVisible();
  });

  test('SC12-TC04 - Menu shows address and Follow Us section', async ({ homePage }) => {
    await homePage.openNavMenu();
    // The nav overlay has a "Follow Us" span — scope to it to avoid footer conflict
    await expect(homePage.page.locator('span').filter({ hasText: /^Follow Us$/ }).last()).toBeVisible();
    await expect(homePage.page.getByText('1720 W Division St, Chicago, IL')).toBeVisible();
  });
});

test.describe('SC13 - Navigation Menu - COMPANY Links', () => {
  test('SC13-TC01 - "About Us" navigates to About page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navAboutUs.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/about/);
  });

  test('SC13-TC02 - "Our Work" navigates to Case Studies page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navOurWork.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/tags\/case-studies/);
  });

  test('SC13-TC03 - "Inside the Box" navigates to Blog page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navInsideTheBox.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/blog/);
  });

  test('SC13-TC04 - "Careers" navigates to Careers job board', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navCareers.click();
    await homePage.page.waitForLoadState('load');
    // Careers redirects to external job board at jobs.gem.com/foxbox-digital
    await expect(homePage.page).toHaveURL(/foxbox-digital|gem\.com/);
  });
});

test.describe('SC14 - Navigation Menu - SOLUTIONS Links', () => {
  test('SC14-TC01 - "Product Lab" navigates to Product Lab page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navProductLab.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/product-lab/);
  });

  test('SC14-TC02 - "Product Maintenance" navigates to Product Maintenance page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navProductMaintenance.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/product-maintenance/);
  });

  test('SC14-TC03 - "Staff Aug+" navigates to Staff Aug page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navStaffAug.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/staff-aug/);
  });

  test('SC14-TC04 - "Healthcare" navigates to Healthcare page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navHealthcare.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/healthcare/);
  });

  test('SC14-TC05 - "AI Readiness Assessment" navigates to Assessment page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navAIReadiness.click();
    await homePage.page.waitForLoadState('load');
    // Actual URL is /assessment
    await expect(homePage.page).toHaveURL(/\/assessment/);
  });
});

test.describe('SC15 - Navigation Menu - WORK Links', () => {
  test('SC15-TC01 - "See All Case Studies" navigates to Case Studies page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navSeeAllCaseStudies.click();
    await homePage.page.waitForLoadState('load');
    // Actual URL is /tags/case-studies
    await expect(homePage.page).toHaveURL(/tags\/case-studies/);
  });

  test('SC15-TC02 - "Airspace Data: Web MVP" navigates to Airspace case study', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navAirspace.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/airspace/i);
  });

  test('SC15-TC03 - "Versapay: Digital Payments Mobile Strategy" navigates to Versapay case study', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navVersapay.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/versapay/i);
  });

  test('SC15-TC04 - "Anthem: Telehealth Mobile App" navigates to Anthem case study', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navAnthem.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/anthem/i);
  });
});

test.describe('SC16 - Footer Navigation Links', () => {
  test('SC16-TC01 - Footer "About" link navigates to About page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerAbout);
    await homePage.footerAbout.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/about/);
  });

  test('SC16-TC02 - Footer "Blog" link navigates to Blog page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerBlog);
    await homePage.footerBlog.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/blog/);
  });

  test('SC16-TC03 - Footer "Careers" link navigates to Careers page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerCareers);
    await homePage.footerCareers.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/gem\.com|greenhouse|jobs/i);
  });

  test('SC16-TC04 - Footer "Approach" link navigates to Approach page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerApproach);
    await homePage.footerApproach.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/approach/);
  });

  test('SC16-TC05 - Footer "Culture" link navigates to Culture page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerCulture);
    await homePage.footerCulture.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/culture/);
  });

  test('SC16-TC06 - Footer "Product Lab" link navigates to Product Lab page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerProductLab);
    await homePage.footerProductLab.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/product-lab/);
  });

  test('SC16-TC07 - Footer "Product Maintenance" link navigates to Product Maintenance page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerProductMaintenance);
    await homePage.footerProductMaintenance.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/product-maintenance/);
  });

  test('SC16-TC08 - Footer "Staff Aug+" link navigates to Staff Aug page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerStaffAug);
    await homePage.footerStaffAug.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/staff-aug/);
  });

  test('SC16-TC09 - Footer "Privacy Policy" link navigates to Privacy Policy page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerPrivacyPolicy);
    await homePage.footerPrivacyPolicy.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/privacy/i);
  });

  test('SC16-TC10 - Footer LinkedIn link is present and points to LinkedIn', async ({ homePage }) => {
    const linkedInLink = homePage.page.locator('footer a[href*="linkedin"]');
    await homePage.scrollToElement(linkedInLink);
    await expect(linkedInLink).toHaveAttribute('href', /linkedin\.com/i);
  });
});

