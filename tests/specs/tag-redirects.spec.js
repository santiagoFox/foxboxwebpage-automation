const { test } = require('../fixtures/fixtures');
const { assertPermanentRedirect, assertPageLive } = require('../utils/http');

// SC38 — FOX2-102: stale blog tag pages now permanently redirect instead of rendering
// empty pages. Special case: /tags/case-studies -> /case-studies; everything else
// (including the /tags index) -> /blog. Active tag pages still return 200.

// Retired tags that redirect to /blog. `case-studies` is handled separately below
// because it has a different destination.
const RETIRED_TAGS_TO_BLOG = [
  'newhire',
  '2019',
  'digital',
  'review',
  'press',
  'podcast',
  'company-update',
  'onboarding',
  'advice',
  'productdevelopment',
  'uxdesign',
];

const pad = (n) => String(n).padStart(2, '0');

test.describe('SC38 - Stale blog tag page redirects (FOX2-102)', () => {
  test('SC38-TC01 - /tags/case-studies redirects to /case-studies', async ({ request }) => {
    await assertPermanentRedirect(request, '/tags/case-studies', '/case-studies');
  });

  RETIRED_TAGS_TO_BLOG.forEach((tag, i) => {
    test(`SC38-TC${pad(i + 2)} - /tags/${tag} redirects to /blog`, async ({ request }) => {
      await assertPermanentRedirect(request, `/tags/${tag}`, '/blog');
    });
  });

  test('SC38-TC13 - /tags index redirects to /blog', async ({ request }) => {
    await assertPermanentRedirect(request, '/tags', '/blog');
  });

  test('SC38-TC14 - Active tag page /tags/engineering still returns 200', async ({ page }) => {
    await assertPageLive(page, '/tags/engineering');
  });
});
