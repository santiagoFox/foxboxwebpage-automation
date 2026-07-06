const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

// SC19 — Case Studies listing. Migrated from the Drupal tag page
// (/tags/case-studies, which now 301-redirects) to /case-studies. The redesign
// dropped the "N posts tagged with" count (former SC19-TC02) and the
// "Browse all tags" link (former SC19-TC07); Airspace is no longer listed, so
// the specific-card check now uses Anthem.
test.describe('SC19 - Case Studies Page', () => {
  test('SC19-TC01 - Page heading is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.pageHeading).toBeVisible();
  });

  test('SC19-TC03 - K Health case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.kHealthCard).toBeVisible();
  });

  test('SC19-TC04 - Anthem case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.anthemCard).toBeVisible();
  });

  test('SC19-TC05 - Versapay case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.versapayCard).toBeVisible();
  });

  test('SC19-TC06 - Home Chef case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.homeChefCard).toBeVisible();
  });

  test('SC19-TC08 - Clicking K Health card navigates to the K Health case study', async ({ caseStudiesPage }) => {
    await caseStudiesPage.kHealthCard.click();
    await caseStudiesPage.waitForPageLoad();
    await expect(caseStudiesPage.page).toHaveURL(/k-?health/i);
  });
});
