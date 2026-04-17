const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC19 - Case Studies Page', () => {
  test('SC19-TC01 - Page heading "case studies" is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.pageHeading).toBeVisible();
  });

  test('SC19-TC02 - Post count text is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.postCount).toBeVisible();
  });

  test('SC19-TC03 - K Health case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.kHealthCard).toBeVisible();
  });

  test('SC19-TC04 - Airspace Data case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.airspaceCard).toBeVisible();
  });

  test('SC19-TC05 - Versapay case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.versapayCard).toBeVisible();
  });

  test('SC19-TC06 - Home Chef case study card is visible', async ({ caseStudiesPage }) => {
    await expect(caseStudiesPage.homeChefCard).toBeVisible();
  });

  test('SC19-TC07 - "Browse all tags" link is visible', async ({ caseStudiesPage }) => {
    await caseStudiesPage.scrollToElement(caseStudiesPage.browseAllTagsLink);
    await expect(caseStudiesPage.browseAllTagsLink).toBeVisible();
  });

  test('SC19-TC08 - Clicking K Health card navigates to the K Health case study', async ({ caseStudiesPage }) => {
    await caseStudiesPage.kHealthCard.click();
    await caseStudiesPage.waitForPageLoad();
    await expect(caseStudiesPage.page).toHaveURL(/k-?health/i);
  });
});
