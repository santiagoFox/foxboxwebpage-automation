const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');
const testData = require('../../data/testData');

test.describe('SC18 - Blog Page', () => {
  test('SC18-TC01 - "Inside the Box" heading is visible', async ({ blogPage }) => {
    await expect(blogPage.heroHeading).toBeVisible();
  });

  test('SC18-TC02 - Blog subheading is visible', async ({ blogPage }) => {
    await expect(blogPage.heroSubheading).toBeVisible();
  });

  test('SC18-TC03 - At least 3 article "Read More" links are rendered', async ({ blogPage }) => {
    const count = await blogPage.articleLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('SC18-TC04 - First article title is visible', async ({ blogPage }) => {
    await expect(blogPage.firstArticleTitle).toBeVisible();
  });

  test('SC18-TC05 - Second article title is visible', async ({ blogPage }) => {
    await expect(blogPage.secondArticleTitle).toBeVisible();
  });

  test('SC18-TC06 - Third article title is visible', async ({ blogPage }) => {
    await expect(blogPage.thirdArticleTitle).toBeVisible();
  });

  test('SC18-TC07 - Article "Read More" links point to blog post URLs', async ({ blogPage }) => {
    await expect(blogPage.articleLinks.first()).toHaveAttribute('href', /\/blog\/.+/);
  });

  test('SC18-TC08 - Clicking first article navigates to a blog post', async ({ blogPage }) => {
    await blogPage.articleLinks.first().click();
    await blogPage.waitForPageLoad();
    await expect(blogPage.page).toHaveURL(/\/blog\/.+/);
  });

  test('SC18-TC09 - Pagination "Next" link is visible', async ({ blogPage }) => {
    await blogPage.scrollToElement(blogPage.paginationNext);
    await expect(blogPage.paginationNext).toBeVisible();
  });

  test('SC18-TC10 - Newsletter signup input and button are present', async ({ blogPage }) => {
    await blogPage.scrollToElement(blogPage.newsletterInput);
    await expect(blogPage.newsletterInput).toBeVisible();
    await expect(blogPage.newsletterSignUpButton).toBeVisible();
  });
});
