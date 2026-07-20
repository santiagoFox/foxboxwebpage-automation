const { test } = require('../fixtures/fixtures');
const { assertPermanentRedirect, assertPageLive } = require('../utils/http');

// SC39 — FOX2-94: the 12 old case-study URLs under /blog/ now permanently redirect to
// their /case-studies/ equivalents. Each redirect maps the same slug across the prefix.
const MIGRATED_SLUGS = [
  'airspace',
  'how-foxbox-modernized-orangeqc-s-android-app-in-two-months',
  'how-we-helped-anthem-launch-a-mobile-telehealth-product',
  'how-we-helped-axis-group',
  'how-we-helped-home-chef-case-study',
  'how-we-helped-property-management-company',
  'how-we-helped-rain-a-cryptocurrency-brokerage',
  'how-we-helped-stormwind-launch-a-customized-automated-e-learning-platform',
  'k-health-ai-healthcare-case-study',
  'nslc-digital-transformation',
  'versapay-mobile-strategy',
  'x-case-study',
];

// All 13 case-study detail pages that must return 200. (Freshpaint has no /blog/
// predecessor, so it is not in the redirect list above but is still a live page.)
const DETAIL_PAGES = [
  'airspace',
  'freshpaint',
  'k-health-ai-healthcare-case-study',
  'versapay-mobile-strategy',
  'how-we-helped-anthem-launch-a-mobile-telehealth-product',
  'nslc-digital-transformation',
  'how-we-helped-stormwind-launch-a-customized-automated-e-learning-platform',
  'how-we-helped-rain-a-cryptocurrency-brokerage',
  'how-we-helped-property-management-company',
  'how-we-helped-home-chef-case-study',
  'how-we-helped-axis-group',
  'how-foxbox-modernized-orangeqc-s-android-app-in-two-months',
  'x-case-study',
];

const pad = (n) => String(n).padStart(2, '0');

test.describe('SC39 - Case study migration redirects (FOX2-94)', () => {
  MIGRATED_SLUGS.forEach((slug, i) => {
    test(`SC39-TC${pad(i + 1)} - /blog/${slug} redirects to /case-studies/${slug}`, async ({ request }) => {
      await assertPermanentRedirect(request, `/blog/${slug}`, `/case-studies/${slug}`);
    });
  });
});

test.describe('SC40 - Case study detail pages live (FOX2-94)', () => {
  test('SC40-TC01 - /case-studies index is live', async ({ page }) => {
    await assertPageLive(page, '/case-studies');
  });

  DETAIL_PAGES.forEach((slug, i) => {
    test(`SC40-TC${pad(i + 2)} - /case-studies/${slug} returns 200`, async ({ page }) => {
      await assertPageLive(page, `/case-studies/${slug}`);
    });
  });
});
