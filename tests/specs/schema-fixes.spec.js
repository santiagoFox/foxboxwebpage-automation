const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

// FOX2-42: Schema bug fixes + typo cleanup
// Four Sanity schema changes verified here via rendered content regression:
//   Fix 1: serviceObject.js + skillObject.js type: 'document' → 'object' (embedded in servicesPage)
//   Fix 2: miscCopy.js tile: typo → title: (Studio label fix, no rendered impact)
//   Fix 3: home.js insigths duplicate removed + insightObject.js 'Insigth' label fixed
//   Fix 4: skillsObject.js title: 'Socials' → 'Skills' (Studio label fix + profile schema)

test.describe('SC35 - Schema Bug Fixes Regression (FOX2-42)', () => {

  // Fix 1 — serviceObject + skillObject rendered as embedded objects
  // Product Lab: skill items under each service section should still be visible

  test('SC35-TC01 - Product Lab "Product strategy" skill item is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.skillProductStrategy);
    await expect(productLabPage.skillProductStrategy).toBeVisible();
  });

  test('SC35-TC02 - Product Lab "User research" skill item is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.skillUserResearch);
    await expect(productLabPage.skillUserResearch).toBeVisible();
  });

  test('SC35-TC03 - Product Lab "UX / UI design" skill item is visible', async ({ productLabPage }) => {
    await productLabPage.scrollToElement(productLabPage.skillUxUiDesign);
    await expect(productLabPage.skillUxUiDesign).toBeVisible();
  });

  // Fix 1 — skillObject rendered in Staff Aug+ tech stack section

  test('SC35-TC04 - Staff Aug "iOS: Swift, Objective-C" tech stack item is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.techStackiOS);
    await expect(staffAugmentationPage.techStackiOS).toBeVisible();
  });

  test('SC35-TC05 - Staff Aug "React.js, Next.js, Remix" tech stack item is visible', async ({ staffAugmentationPage }) => {
    await staffAugmentationPage.scrollToElement(staffAugmentationPage.techStackReactJs);
    await expect(staffAugmentationPage.techStackReactJs).toBeVisible();
  });

  // Fix 3 — insightObject label fix (home.js insigths duplicate removed)
  // Insight articles on the home page should still render with non-empty titles

  test('SC35-TC06 - Home page first blog article has a non-empty title', async ({ homePage }) => {
    await homePage.scrollToElement(homePage.firstArticleTitle);
    await expect(homePage.firstArticleTitle).toBeVisible();
    // Verify the aria-label contains actual title content (not just "Read more about ")
    await expect(homePage.firstArticleTitle).toHaveAttribute('aria-label', /Read more about \S+/);
  });

  // Fix 4 — skillsObject profile schema + team member profiles

  test('SC35-TC07 - About page "Trent Edwards" profile is visible', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.trentEdwardsCard);
    await expect(aboutPage.trentEdwardsCard).toBeVisible();
  });

  test('SC35-TC08 - About page team member role "Founder & CEO" is visible', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.robVolkRole);
    await expect(aboutPage.robVolkRole).toBeVisible();
  });

  test('SC35-TC09 - About page "Chief Technology Officer" role is visible', async ({ aboutPage }) => {
    await aboutPage.scrollToElement(aboutPage.elliottTorresRole);
    await expect(aboutPage.elliottTorresRole).toBeVisible();
  });

});
