const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC29 - Privacy Policy Page', () => {
  test('SC29-TC01 - Page heading "Web Site Terms and Conditions of Use" is visible', async ({ privacyPage }) => {
    await expect(privacyPage.pageHeading).toBeVisible();
  });

  test('SC29-TC02 - "1. Terms" section heading is visible', async ({ privacyPage }) => {
    await privacyPage.scrollToElement(privacyPage.termsHeading);
    await expect(privacyPage.termsHeading).toBeVisible();
  });

  test('SC29-TC03 - "Use License" section heading is visible', async ({ privacyPage }) => {
    await privacyPage.scrollToElement(privacyPage.useLicenseHeading);
    await expect(privacyPage.useLicenseHeading).toBeVisible();
  });

  test('SC29-TC04 - "Disclaimer" section heading is visible', async ({ privacyPage }) => {
    await privacyPage.scrollToElement(privacyPage.disclaimerHeading);
    await expect(privacyPage.disclaimerHeading).toBeVisible();
  });

  test('SC29-TC05 - "Governing Law" section heading is visible', async ({ privacyPage }) => {
    await privacyPage.scrollToElement(privacyPage.governingLawHeading);
    await expect(privacyPage.governingLawHeading).toBeVisible();
  });

  test('SC29-TC06 - "Privacy Policy" section heading is visible', async ({ privacyPage }) => {
    await privacyPage.scrollToElement(privacyPage.privacyPolicyHeading);
    await expect(privacyPage.privacyPolicyHeading).toBeVisible();
  });

  test('SC29-TC07 - Privacy policy introductory text is visible', async ({ privacyPage }) => {
    await privacyPage.scrollToElement(privacyPage.privacyIntroText);
    await expect(privacyPage.privacyIntroText).toBeVisible();
  });
});
