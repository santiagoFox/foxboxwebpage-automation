const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');
const testData = require('../../data/testData');

test.describe('SC17 - About Page', () => {
  test('SC17-TC01 - "WHO WE ARE" heading is visible', async ({ aboutPage }) => {
    await expect(aboutPage.whoWeAreHeading).toBeVisible();
  });

  test('SC17-TC02 - Hero heading is visible', async ({ aboutPage }) => {
    await expect(aboutPage.heroHeading).toBeVisible();
  });

  test('SC17-TC03 - Hero subheading is visible', async ({ aboutPage }) => {
    await expect(aboutPage.heroSubheading).toBeVisible();
  });

  test('SC17-TC04 - "Our Leadership Team" heading is visible', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.leadershipHeading);
    await expect(aboutPage.leadershipHeading).toBeVisible();
  });

  test('SC17-TC05 - Rob Volk is listed in the leadership team', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.robVolkCard);
    await expect(aboutPage.robVolkCard).toBeVisible();
  });

  test('SC17-TC06 - Elliott Torres is listed in the leadership team', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.elliottTorresCard);
    await expect(aboutPage.elliottTorresCard).toBeVisible();
  });

  test('SC17-TC07 - Barrett Willich is listed in the leadership team', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.barrettWillichCard);
    await expect(aboutPage.barrettWillichCard).toBeVisible();
  });

  test('SC17-TC08 - "WHY FOXBOX?" section heading is visible', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.whyFoxboxHeading);
    await expect(aboutPage.whyFoxboxHeading).toBeVisible();
  });

  test('SC17-TC09 - "CHAT WITH US" CTA button is visible', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.chatWithUsButton);
    await expect(aboutPage.chatWithUsButton).toBeVisible();
  });

  test('SC17-TC10 - "What We Believe" section is visible', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.whatWeBelieveHeading);
    await expect(aboutPage.whatWeBelieveHeading).toBeVisible();
  });

  test('SC17-TC11 - Newsletter signup input and button are present', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.newsletterInput);
    await expect(aboutPage.newsletterInput).toBeVisible();
    await expect(aboutPage.newsletterSignUpButton).toBeVisible();
  });
});
