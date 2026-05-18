const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

test.describe('SC27 - Approach Page', () => {
  test('SC27-TC01 - Hero heading "How We Get Things Done" is visible', async ({ approachPage }) => {
    await expect(approachPage.heroHeading).toBeVisible();
  });

  test('SC27-TC02 - "The 7 Things That Enable Us to Build Great Products" heading is visible', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.sevenThingsHeading);
    await expect(approachPage.sevenThingsHeading).toBeVisible();
  });

  test('SC27-TC03 - "Hire the best people" principle heading is visible', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.hireBestPeopleHeading);
    await expect(approachPage.hireBestPeopleHeading).toBeVisible();
  });

  test('SC27-TC04 - "Flexible cross-functional product teams" heading is visible', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.crossFunctionalTeamsHeading);
    await expect(approachPage.crossFunctionalTeamsHeading).toBeVisible();
  });

  test('SC27-TC05 - "Human-centered Design, Agile" heading is visible', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.humanCenteredHeading);
    await expect(approachPage.humanCenteredHeading).toBeVisible();
  });

  test('SC27-TC06 - "Executive visibility done right" heading is visible', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.executiveVisibilityHeading);
    await expect(approachPage.executiveVisibilityHeading).toBeVisible();
  });

  test('SC27-TC07 - "Long-term partnerships & support" heading is visible', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.longTermPartnershipsHeading);
    await expect(approachPage.longTermPartnershipsHeading).toBeVisible();
  });

  test('SC27-TC08 - "Let\'s Get Things Done, Together" CTA heading is visible', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.letsGetThingsDoneHeading);
    await expect(approachPage.letsGetThingsDoneHeading).toBeVisible();
  });

  test('SC27-TC09 - Plamen Petrov testimonial quote is visible', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.plamenPetrovQuote);
    await expect(approachPage.plamenPetrovQuote).toBeVisible();
  });

  test('SC27-TC10 - Newsletter signup input and button are present', async ({ approachPage }) => {
    await approachPage.scrollToElement(approachPage.newsletterInput);
    await expect(approachPage.newsletterInput).toBeVisible();
    await expect(approachPage.newsletterSignUpButton).toBeVisible();
  });
});
