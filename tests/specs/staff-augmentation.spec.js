const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC26 - Staff Augmentation Page', () => {
  test('SC26-TC01 - Hero heading "Staff Aug+" is visible', async ({ staffAugmentationPage }) => {
    await expect(staffAugmentationPage.heroHeading).toBeVisible();
  });

  test('SC26-TC02 - Hero subheading "Get the hands-on help you need." is visible', async ({ staffAugmentationPage }) => {
    await expect(staffAugmentationPage.heroSubheading).toBeVisible();
  });

  test('SC26-TC03 - "Cross-Functional Talent" section heading is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.crossFunctionalHeading);
    await expect(staffAugmentationPage.crossFunctionalHeading).toBeVisible();
  });

  test('SC26-TC04 - "Scalable Delivery" section heading is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.scalableDeliveryHeading);
    await expect(staffAugmentationPage.scalableDeliveryHeading).toBeVisible();
  });

  test('SC26-TC05 - "Proactive Oversight" section heading is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.proactiveOversightHeading);
    await expect(staffAugmentationPage.proactiveOversightHeading).toBeVisible();
  });

  test('SC26-TC06 - "Our Tech Stack" section heading is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.techStackHeading);
    await expect(staffAugmentationPage.techStackHeading).toBeVisible();
  });

  test('SC26-TC07 - "Want to learn more?" CTA heading is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.wantToLearnMoreHeading);
    await expect(staffAugmentationPage.wantToLearnMoreHeading).toBeVisible();
  });

  test('SC26-TC08 - "Get in touch" link is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.getInTouchLink);
    await expect(staffAugmentationPage.getInTouchLink).toBeVisible();
  });

  test('SC26-TC09 - "Go to Product Lab" cross-link is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.goToProductLabLink);
    await expect(staffAugmentationPage.goToProductLabLink).toBeVisible();
  });

  test('SC26-TC10 - Newsletter signup input and button are present', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.newsletterInput);
    await expect(staffAugmentationPage.newsletterInput).toBeVisible();
    await expect(staffAugmentationPage.newsletterSignUpButton).toBeVisible();
  });
});
