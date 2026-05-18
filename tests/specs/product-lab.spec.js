const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC24 - Product Lab Page', () => {
  test('SC24-TC01 - Hero heading is visible', async ({ productLabPage }) => {
    await expect(productLabPage.heroHeading).toBeVisible();
  });

  test('SC24-TC02 - "DEFINE THE PROBLEM" section heading is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.defineProblemHeading);
    await expect(productLabPage.defineProblemHeading).toBeVisible();
  });

  test('SC24-TC03 - "ITERATE RAPIDLY" section heading is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.iterateRapidlyHeading);
    await expect(productLabPage.iterateRapidlyHeading).toBeVisible();
  });

  test('SC24-TC04 - "BUILD FOR THE FUTURE" section heading is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.buildForFutureHeading);
    await expect(productLabPage.buildForFutureHeading).toBeVisible();
  });

  test('SC24-TC05 - "A PROPERLY CALIBRATED MVP" section heading is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.calibratedMvpHeading);
    await expect(productLabPage.calibratedMvpHeading).toBeVisible();
  });

  test('SC24-TC06 - "HUMAN EXPERTISE" section heading is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.humanExpertiseHeading);
    await expect(productLabPage.humanExpertiseHeading).toBeVisible();
  });

  test('SC24-TC07 - "AI-NATIVE DEVELOPMENT" section heading is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.aiNativeDevelopmentHeading);
    await expect(productLabPage.aiNativeDevelopmentHeading).toBeVisible();
  });

  test('SC24-TC08 - "Ready to get building?" CTA heading is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.readyToBuildHeading);
    await expect(productLabPage.readyToBuildHeading).toBeVisible();
  });

  test('SC24-TC09 - Airspace case study link is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.airspaceCaseStudyLink);
    await expect(productLabPage.airspaceCaseStudyLink).toBeVisible();
  });

  test('SC24-TC10 - Newsletter signup input and button are present', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.newsletterInput);
    await expect(productLabPage.newsletterInput).toBeVisible();
    await expect(productLabPage.newsletterSignUpButton).toBeVisible();
  });
});
