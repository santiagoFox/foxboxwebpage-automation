const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

// SC19 — Case Studies listing. Migrated from the Drupal tag page
// (/tags/case-studies, which now redirects) to /case-studies. The redesign
// dropped the "N posts tagged with" count (former SC19-TC02) and the
// "Browse all tags" link (former SC19-TC07).
//
// The prod index lists 9 case studies (Freshpaint, K Health, Airspace, Axis
// Group, Rain, Versapay, OrangeQC, Stormwind, The X Company). Anthem and Home
// Chef have live detail pages (SC40) but are NOT surfaced on the index, so the
// specific-card checks use K Health, Airspace, Versapay, and Freshpaint.
test.describe('SC19 - Case Studies Page', () => {
  test('SC19-TC01 - Page heading is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.pageHeading).toBeVisible();
  });

  test('SC19-TC03 - K Health case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.kHealthCard).toBeVisible();
  });

  test('SC19-TC04 - Airspace case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.airspaceCard).toBeVisible();
  });

  test('SC19-TC05 - Versapay case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.versapayCard).toBeVisible();
  });

  test('SC19-TC06 - Freshpaint case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.freshpaintCard).toBeVisible();
  });

  test('SC19-TC08 - Clicking K Health card navigates to the K Health case study', async ({ caseStudiesPage }) => {
    await caseStudiesPage.kHealthCard.click();
    await caseStudiesPage.waitForPageLoad();
    await expect(caseStudiesPage.page).toHaveURL(/k-?health/i);
  });
});
