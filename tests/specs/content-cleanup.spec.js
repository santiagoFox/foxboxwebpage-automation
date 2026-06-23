const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

// FOX2-40: Studio content cleanup
//   1. /testforlayouts route deleted → 404
//   2. "See All Case Studies" nav link uses relative href (not absolute foxbox.com URL)
//   3. Four orphaned /services/* pages must be gone
//
// FOX2-100: the four orphaned /services pages intermittently get re-published.
// Raw HTTP status is NOT a reliable gate on this site — live pages (e.g.
// /staff-aug) also return 404 to a direct GET, and "restored" windows can be
// soft-404s (HTTP 200 + a "Page Not Found" body). So we GATE on what a real
// user/crawler sees — the rendered "Page Not Found" page — and LOG the HTTP +
// nav status as diagnostic evidence for the ticket (never the pass/fail gate).

const ORPHANED_SERVICES = [
  '/services/react-native-consulting',
  '/services/react-native-mobile-app-development',
  '/services/elixir-web-development-services',
  '/services/elixir-consulting-services',
];

// Gate: the page must render the "Page Not Found" UI (i.e. not restored with
// real content). Diagnostic: capture raw HTTP status + browser-nav status +
// timestamp and attach them to the report for FOX2-100 — without gating on them.
async function assertOrphanedPageGone({ page, request }, path, testInfo) {
  let httpStatus = 'n/a';
  try {
    const r = await request.get(path, { maxRedirects: 5 });
    httpStatus = r.status();
  } catch (e) {
    httpStatus = `error: ${e.message}`;
  }

  const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
  const navStatus = resp ? resp.status() : 'n/a';

  const note = `[FOX2-100] ${path} httpStatus=${httpStatus} navStatus=${navStatus} at=${new Date().toISOString()}`;
  console.log(note);
  await testInfo.attach('fox2-100-status', { body: note, contentType: 'text/plain' });

  // GATE (content): user/crawler must see the not-found page.
  await expect(
    page.getByText(/page not found/i),
    `${path} did NOT render the "Page Not Found" page — the orphaned page may be restored with real content (FOX2-100). ${note}`
  ).toBeVisible();
}

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

  // TC03–06: orphaned /services pages must show "Page Not Found" (not restored — FOX2-100).
  test('SC34-TC03 - /services/react-native-consulting shows Page Not Found (FOX2-100)', async ({ page, request }, testInfo) => {
    await assertOrphanedPageGone({ page, request }, ORPHANED_SERVICES[0], testInfo);
  });

  test('SC34-TC04 - /services/react-native-mobile-app-development shows Page Not Found (FOX2-100)', async ({ page, request }, testInfo) => {
    await assertOrphanedPageGone({ page, request }, ORPHANED_SERVICES[1], testInfo);
  });

  test('SC34-TC05 - /services/elixir-web-development-services shows Page Not Found (FOX2-100)', async ({ page, request }, testInfo) => {
    await assertOrphanedPageGone({ page, request }, ORPHANED_SERVICES[2], testInfo);
  });

  test('SC34-TC06 - /services/elixir-consulting-services shows Page Not Found (FOX2-100)', async ({ page, request }, testInfo) => {
    await assertOrphanedPageGone({ page, request }, ORPHANED_SERVICES[3], testInfo);
  });

});
