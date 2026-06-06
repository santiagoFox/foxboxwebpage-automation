const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC28 - Culture Page', () => {
  test('SC28-TC01 - Hero heading "Move Purposely." is visible', async ({ culturePage }) => {
    await expect(culturePage.heroHeading).toBeVisible();
  });

  test('SC28-TC02 - "Move Purposely." section heading is visible', async ({ culturePage }) => {
    await culturePage.scrollToElement(culturePage.movePurposelyHeading);
    await expect(culturePage.movePurposelyHeading).toBeVisible();
  });

  test('SC28-TC03 - "The Foxbox Way" section heading is visible', async ({ culturePage }) => {
    await culturePage.scrollToElement(culturePage.foxboxWayHeading);
    await expect(culturePage.foxboxWayHeading).toBeVisible();
  });

  // SC28-TC04 (We are Hiring! heading) removed — hiring section deleted from
  // /about/culture per FOX2-56 (Maxx's call: revamp later with proper jobs link).

  test('SC28-TC05 - "What We Believe" section heading is visible', async ({ culturePage }) => {
    await culturePage.scrollToElement(culturePage.whatWeBelieveHeading);
    await expect(culturePage.whatWeBelieveHeading).toBeVisible();
  });

  test('SC28-TC06 - All 6 core beliefs are listed', async ({ culturePage }) => {
    await culturePage.scrollToElement(culturePage.belief1);
    await expect(culturePage.belief1).toBeVisible();
    await expect(culturePage.belief2).toBeVisible();
    await expect(culturePage.belief3).toBeVisible();
    await expect(culturePage.belief4).toBeVisible();
    await expect(culturePage.belief5).toBeVisible();
    await expect(culturePage.belief6).toBeVisible();
  });

  // SC28-TC07 (WORK WITH US CTA link) removed — same FOX2-56 section deletion.

  test('SC28-TC08 - Newsletter signup input and button are present', async ({ culturePage }) => {
    await culturePage.scrollToElement(culturePage.newsletterInput);
    await expect(culturePage.newsletterInput).toBeVisible();
    await expect(culturePage.newsletterSignUpButton).toBeVisible();
  });
});
