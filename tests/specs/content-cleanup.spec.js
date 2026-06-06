const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

// FOX2-40: Studio content cleanup
// Verifies the three actions from the checklist:
//   1. /testforlayouts route deleted → 404
//   2. "See All Case Studies" nav link uses relative href (not absolute foxbox.com URL)
//   3. Four orphaned /services/* pages deleted → 404

test.describe('SC34 - Studio Content Cleanup (FOX2-40)', () => {

  test('SC34-TC01 - /testforlayouts route returns 404', async ({ request }) => {
    const res = await request.get('/testforlayouts', { maxRedirects: 5 });
    expect(res.status()).toBe(404);
  });

  test('SC34-TC02 - "See All Case Studies" nav link uses relative path /tags/case-studies', async ({ homePage }) => {
    // STEP 1: Open the hamburger nav menu
    await homePage.openNavMenu();

    // STEP 2: Verify href is relative — not the previous absolute https://www.foxbox.com/tags/case-studies
    const href = await homePage.navSeeAllCaseStudies.getAttribute('href');
    expect(href).toBe('/tags/case-studies');
  });

  test('SC34-TC03 - /services/react-native-consulting orphaned page returns 404', async ({ request }) => {
    const res = await request.get('/services/react-native-consulting', { maxRedirects: 5 });
    expect(res.status()).toBe(404);
  });

  test('SC34-TC04 - /services/react-native-mobile-app-development orphaned page returns 404', async ({ request }) => {
    const res = await request.get('/services/react-native-mobile-app-development', { maxRedirects: 5 });
    expect(res.status()).toBe(404);
  });

  test('SC34-TC05 - /services/elixir-web-development-services orphaned page returns 404', async ({ request }) => {
    const res = await request.get('/services/elixir-web-development-services', { maxRedirects: 5 });
    expect(res.status()).toBe(404);
  });

  test('SC34-TC06 - /services/elixir-consulting-services orphaned page returns 404', async ({ request }) => {
    const res = await request.get('/services/elixir-consulting-services', { maxRedirects: 5 });
    expect(res.status()).toBe(404);
  });

});
