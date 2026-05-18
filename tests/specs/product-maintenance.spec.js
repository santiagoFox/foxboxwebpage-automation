const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC25 - Product Maintenance Page', () => {
  test('SC25-TC01 - Hero heading "Foxbox is on it." is visible', async ({ productMaintenancePage }) => {
    await expect(productMaintenancePage.heroHeading).toBeVisible();
  });

  test('SC25-TC02 - "Proactive Maintenance" section heading is visible', async ({ productMaintenancePage }) => {
    await productMaintenancePage.scrollToElement(productMaintenancePage.proactiveMaintenanceHeading);
    await expect(productMaintenancePage.proactiveMaintenanceHeading).toBeVisible();
  });

  test('SC25-TC03 - "Predictable Support" section heading is visible', async ({ productMaintenancePage }) => {
    await productMaintenancePage.scrollToElement(productMaintenancePage.predictableSupportHeading);
    await expect(productMaintenancePage.predictableSupportHeading).toBeVisible();
  });

  test('SC25-TC04 - "Peace of Mind" section heading is visible', async ({ productMaintenancePage }) => {
    await productMaintenancePage.scrollToElement(productMaintenancePage.peaceOfMindHeading);
    await expect(productMaintenancePage.peaceOfMindHeading).toBeVisible();
  });

  test('SC25-TC05 - "Versapay\'s Mobile Strategy" case study heading is visible', async ({ productMaintenancePage }) => {
    await productMaintenancePage.scrollToElement(productMaintenancePage.versapayHeading);
    await expect(productMaintenancePage.versapayHeading).toBeVisible();
  });

  test('SC25-TC06 - "Craving more predictability" CTA heading is visible', async ({ productMaintenancePage }) => {
    await productMaintenancePage.scrollToElement(productMaintenancePage.craveMoreHeading);
    await expect(productMaintenancePage.craveMoreHeading).toBeVisible();
  });

  test('SC25-TC07 - "Let\'s chat" contact link is visible', async ({ productMaintenancePage }) => {
    await productMaintenancePage.scrollToElement(productMaintenancePage.letsChatLink);
    await expect(productMaintenancePage.letsChatLink).toBeVisible();
  });

  test('SC25-TC08 - Newsletter signup input and button are present', async ({ productMaintenancePage }) => {
    await productMaintenancePage.scrollToElement(productMaintenancePage.newsletterInput);
    await expect(productMaintenancePage.newsletterInput).toBeVisible();
    await expect(productMaintenancePage.newsletterSignUpButton).toBeVisible();
  });
});
