const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC22 - Contact Form (All Cookies Accepted)', () => {

  test('SC22-TC01 - "Let\'s Chat" page heading is visible', async ({ contactPageAllCookies }) => {
    await expect(contactPageAllCookies.pageHeading).toBeVisible();
  });

  test('SC22-TC02 - Page subheading is visible', async ({ contactPageAllCookies }) => {
    await expect(contactPageAllCookies.pageSubheading).toBeVisible();
  });

  test('SC22-TC03 - Office locations are displayed', async ({ contactPageAllCookies }) => {
    await expect(contactPageAllCookies.chicagoOffice).toBeVisible();
    await expect(contactPageAllCookies.denverOffice).toBeVisible();
    await expect(contactPageAllCookies.brazilOffice).toBeVisible();
    await expect(contactPageAllCookies.argentinaOffice).toBeVisible();
  });

  test('SC22-TC04 - Contact form is visible with all required fields', async ({ contactPageAllCookies }) => {
    await expect(contactPageAllCookies.formEmail).toBeVisible();
    await expect(contactPageAllCookies.formFirstName).toBeVisible();
    await expect(contactPageAllCookies.formLastName).toBeVisible();
    await expect(contactPageAllCookies.formJobTitle).toBeVisible();
    await expect(contactPageAllCookies.formMessage).toBeVisible();
  });

  test('SC22-TC05 - "What can Foxbox do for you?" checkboxes are present', async ({ contactPageAllCookies }) => {
    await expect(contactPageAllCookies.checkboxNewProduct).toBeVisible();
    await expect(contactPageAllCookies.checkboxImprove).toBeVisible();
    await expect(contactPageAllCookies.checkboxOther).toBeVisible();
  });

  test('SC22-TC06 - Submit button is present', async ({ contactPageAllCookies }) => {
    await expect(contactPageAllCookies.formSubmitBtn).toBeVisible();
  });

  test('SC22-TC07 - Form fields accept input', async ({ contactPageAllCookies }) => {
    await contactPageAllCookies.formEmail.fill('test@example.com');
    await expect(contactPageAllCookies.formEmail).toHaveValue('test@example.com');

    await contactPageAllCookies.formFirstName.fill('Jane');
    await expect(contactPageAllCookies.formFirstName).toHaveValue('Jane');

    await contactPageAllCookies.formLastName.fill('Doe');
    await expect(contactPageAllCookies.formLastName).toHaveValue('Doe');
  });

});

test.describe('SC23 - Contact Form (Essential Cookies Only)', () => {

  // Regression test for: HubspotContactForm returning null when canUseMarketing = false
  // (bug reported 2026-05-13, fixed same day — form must always be accessible)

  test('SC23-TC01 - "Let\'s Chat" page heading is visible', async ({ contactPageEssentialCookies }) => {
    await expect(contactPageEssentialCookies.pageHeading).toBeVisible();
  });

  test('SC23-TC02 - Office locations are displayed', async ({ contactPageEssentialCookies }) => {
    await expect(contactPageEssentialCookies.chicagoOffice).toBeVisible();
    await expect(contactPageEssentialCookies.denverOffice).toBeVisible();
    await expect(contactPageEssentialCookies.brazilOffice).toBeVisible();
    await expect(contactPageEssentialCookies.argentinaOffice).toBeVisible();
  });

  test('SC23-TC03 - Contact form is visible even with essential cookies only', async ({ contactPageEssentialCookies }) => {
    await expect(contactPageEssentialCookies.formEmail).toBeVisible();
    await expect(contactPageEssentialCookies.formFirstName).toBeVisible();
    await expect(contactPageEssentialCookies.formLastName).toBeVisible();
    await expect(contactPageEssentialCookies.formMessage).toBeVisible();
  });

  test('SC23-TC04 - Submit button is present with essential cookies only', async ({ contactPageEssentialCookies }) => {
    await expect(contactPageEssentialCookies.formSubmitBtn).toBeVisible();
  });

  test('SC23-TC05 - Form fields accept input with essential cookies only', async ({ contactPageEssentialCookies }) => {
    await contactPageEssentialCookies.formEmail.fill('test@example.com');
    await expect(contactPageEssentialCookies.formEmail).toHaveValue('test@example.com');
  });

});
