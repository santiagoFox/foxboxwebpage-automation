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

  test('SC12-TC04 - Menu shows Follow Us section', async ({ homePage }) => {
    await homePage.openNavMenu();
    // The nav overlay has a "Follow Us" span — scope to it to avoid footer conflict
    await expect(homePage.page.locator('span').filter({ hasText: /^Follow Us$/ }).last()).toBeVisible();
  });
});

test.describe('SC13 - Navigation Menu - COMPANY Links', () => {
  test('SC13-TC01 - "About Us" navigates to About page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navAboutUs.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/about/);
  });

  test('SC13-TC02 - "Case Studies" navigates to Case Studies page', async ({ homePage }) => {
    await homePage.openNavMenu();
    // The header nav item was relabelled "Our Work" -> "Case Studies" (same /case-studies target).
    await homePage.navCaseStudies.click();
    await homePage.page.waitForLoadState('load');
    // FOX2-129: nav link migrated from /tags/case-studies to /case-studies.
    await expect(homePage.page).toHaveURL(/\/case-studies$/);
  });

  test('SC13-TC03 - "Inside the Box" navigates to Blog page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navInsideTheBox.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/blog/);
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
    // Anchored to /services/healthcare: the old /\/healthcare/ pattern also
    // matched the migrated URL, so this assertion passed straight through the
    // /services/* route migration without noticing it. Bare /healthcare is now
    // a hard 404.
    await expect(homePage.page).toHaveURL(/\/services\/healthcare$/);
  });
});

test.describe('SC15 - Navigation Menu - WORK Links', () => {
  test('SC15-TC01 - "See All Case Studies" navigates to Case Studies page', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navSeeAllCaseStudies.click();
    await homePage.page.waitForLoadState('load');
    // FOX2-129: migrated from /tags/case-studies to /case-studies.
    await expect(homePage.page).toHaveURL(/\/case-studies$/);
  });

  test('SC15-TC02 - "K Health: AI Healthcare" navigates to K Health case study', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navKHealth.click();
    await homePage.page.waitForLoadState('load');
    // FOX2-94: featured case-study links now live under /case-studies/ (was /blog/).
    await expect(homePage.page).toHaveURL(/\/case-studies\/.*k-health/i);
  });

  test('SC15-TC03 - "Versapay: Digital Payments Mobile Strategy" navigates to Versapay case study', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navVersapay.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/case-studies\/.*versapay/i);
  });

  test('SC15-TC04 - "Anthem: Telehealth Mobile App" navigates to Anthem case study', async ({ homePage }) => {
    await homePage.openNavMenu();
    await homePage.navAnthem.click();
    await homePage.page.waitForLoadState('load');
    await expect(homePage.page).toHaveURL(/\/case-studies\/.*anthem/i);
  });
});

test.describe('SC16 - Footer Navigation Links', () => {
  test('SC16-TC01 - Footer "About" link points to About page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerAbout);
    await expect(homePage.footerAbout).toHaveAttribute('href', /\/about/);
  });

  test('SC16-TC02 - Footer "Blog" link points to Blog page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerBlog);
    await expect(homePage.footerBlog).toHaveAttribute('href', /\/blog/);
  });

  test('SC16-TC03 - Footer "Careers" link is not present', async ({ homePage }) => {
    await expect(homePage.page.locator('footer').getByRole('link', { name: 'Careers' })).not.toBeVisible();
  });

  test('SC16-TC04 - Footer "Approach" link points to Approach page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerApproach);
    await expect(homePage.footerApproach).toHaveAttribute('href', /\/approach/);
  });

  test('SC16-TC05 - Footer "Culture" link points to Culture page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerCulture);
    await expect(homePage.footerCulture).toHaveAttribute('href', /\/culture/);
  });

  test('SC16-TC06 - Footer "Product Lab" link points to Product Lab page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerProductLab);
    await expect(homePage.footerProductLab).toHaveAttribute('href', /\/product-lab/);
  });

  test('SC16-TC07 - Footer "Product Maintenance" link points to Product Maintenance page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerProductMaintenance);
    await expect(homePage.footerProductMaintenance).toHaveAttribute('href', /\/product-maintenance/);
  });

  test('SC16-TC08 - Footer "Staff Aug+" link points to Staff Aug page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerStaffAug);
    await expect(homePage.footerStaffAug).toHaveAttribute('href', /\/staff-aug/);
  });

  test('SC16-TC09 - Footer "Privacy Policy" link points to Privacy Policy page', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.footerPrivacyPolicy);
    await expect(homePage.footerPrivacyPolicy).toHaveAttribute('href', /privacy/i);
  });

  test('SC16-TC10 - Footer LinkedIn link is present and points to LinkedIn', async ({ homePage }) => {
    const linkedInLink = homePage.page.locator('footer a[href*="linkedin"]');
    await homePage.scrollToElement(linkedInLink);
    await expect(linkedInLink).toHaveAttribute('href', /linkedin\.com/i);
  });
});

test.describe('SC20 - Footer Link Health', () => {
  async function assertLinkResolves(locator, request, label) {
    const href = await locator.getAttribute('href');
    const response = await request.get(href);
    expect(
      response.status(),
      `Footer "${label}" → ${href} returned HTTP ${response.status()}`
    ).toBeLessThan(400);
  }

  test('SC20-TC01 - Footer "Contact us" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerContactUs, request, 'Contact us');
  });

  test('SC20-TC02 - Footer "About" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerAbout, request, 'About');
  });

  test('SC20-TC03 - Footer "Blog" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerBlog, request, 'Blog');
  });

  test('SC20-TC05 - Footer "Approach" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerApproach, request, 'Approach');
  });

  test('SC20-TC06 - Footer "Culture" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerCulture, request, 'Culture');
  });

  test('SC20-TC07 - Footer "Product Lab" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerProductLab, request, 'Product Lab');
  });

  test('SC20-TC08 - Footer "Product Maintenance" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerProductMaintenance, request, 'Product Maintenance');
  });

  test('SC20-TC09 - Footer "Staff Aug+" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerStaffAug, request, 'Staff Aug+');
  });

  test('SC20-TC10 - Footer "Privacy Policy" link resolves successfully', async ({ homePage, request }) => {
    await assertLinkResolves(homePage.footerPrivacyPolicy, request, 'Privacy Policy');
  });

  test('SC20-TC11 - Footer LinkedIn link resolves successfully', async ({ homePage, request }) => {
    const locator = homePage.page.locator('footer a[href*="linkedin"]');
    await assertLinkResolves(locator, request, 'LinkedIn');
  });
});

// SC41 — FOX2-129: the nav (hamburger menu) document was updated so its case-study
// links point at /case-studies instead of the old /tags/case-studies and /blog/*
// URLs. Asserting the href attribute directly (not just the post-redirect URL) so a
// regression to the old target is caught even though the old paths still redirect.
test.describe('SC41 - Navigation menu case-study links point to /case-studies (FOX2-129)', () => {
  test('SC41-TC01 - "Case Studies" href is /case-studies', async ({ homePage }) => {
    await homePage.openNavMenu();
    await expect(homePage.navCaseStudies).toHaveAttribute('href', '/case-studies');
  });

  test('SC41-TC02 - "See All Case Studies" href is /case-studies', async ({ homePage }) => {
    await homePage.openNavMenu();
    await expect(homePage.navSeeAllCaseStudies).toHaveAttribute('href', '/case-studies');
  });

  test('SC41-TC03 - "K Health" featured link href is under /case-studies/', async ({ homePage }) => {
    await homePage.openNavMenu();
    await expect(homePage.navKHealth).toHaveAttribute('href', /^\/case-studies\/.*k-health/i);
  });

  test('SC41-TC04 - "Versapay" featured link href is under /case-studies/', async ({ homePage }) => {
    await homePage.openNavMenu();
    await expect(homePage.navVersapay).toHaveAttribute('href', /^\/case-studies\/.*versapay/i);
  });

  test('SC41-TC05 - "Anthem" featured link href is under /case-studies/', async ({ homePage }) => {
    await homePage.openNavMenu();
    await expect(homePage.navAnthem).toHaveAttribute('href', /^\/case-studies\/.*anthem/i);
  });
});

