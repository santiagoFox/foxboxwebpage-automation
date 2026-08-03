/**
 * SC21 - Full Site Link Health (FOX2-71, FOX2-72)
 *
 * For each seed page, collects every unique internal <a href> and makes an
 * HTTP GET request to it. Any response >= 400 is reported as a failure.
 * Redirects (3xx) are not followed — a redirect means the link is alive.
 *
 * "Internal" means the resolved URL is on the configured baseURL host.
 * External links (LinkedIn, feedback portals, jobs.gem.com, etc.) are skipped —
 * those are FOX2-90/FOX2-91 scope and belong in a separate non-gating spec.
 *
 * FIXED(2026-07-31): this file hardcoded `https://staging.foxbox.com` and ignored
 * the config baseURL, so the one suite meant to catch broken links was never
 * exercising production. It now derives the host from the `baseURL` fixture.
 * The seed list was also still on pre-migration routes — updated for the
 * /services/* migration and FOX2-94/FOX2-129 case-study routes.
 */
const { test, expect } = require('@playwright/test');

const SEED_PAGES = [
  { label: 'Home',                path: '/' },
  { label: 'About',               path: '/about/us' },
  { label: 'Culture',             path: '/about/culture' },
  { label: 'Approach',            path: '/approach' },
  { label: 'Blog',                path: '/blog' },
  { label: 'Case Studies',        path: '/case-studies' },
  { label: 'Services',            path: '/services' },
  { label: 'Healthcare',          path: '/services/healthcare' },
  { label: 'Product Lab',         path: '/services/product-lab' },
  { label: 'Product Maintenance', path: '/services/product-maintenance' },
  { label: 'Staff Aug+',          path: '/services/staff-augmentation' },
  { label: 'AI Native Assessment', path: '/ai-native-assessment' },
  { label: 'Contact',             path: '/contact' },
  { label: 'Privacy',             path: '/privacy' },
];

/**
 * Visits a page and returns the set of unique, normalised internal URLs
 * found in every <a href> on that page.
 */
async function collectInternalLinks(page, path, BASE) {
  await page.goto(`${BASE}${path}`);
  await page.waitForLoadState('load');

  const hrefs = await page.locator('a[href]').evaluateAll(
    anchors => anchors.map(a => a.getAttribute('href')).filter(Boolean)
  );

  const links = new Set();
  for (const href of hrefs) {
    if (/^(mailto:|tel:|javascript:|#)/.test(href)) continue;

    let absolute;
    if (href.startsWith('http')) {
      absolute = href;
    } else if (href.startsWith('/')) {
      absolute = `${BASE}${href}`;
    } else {
      continue;
    }

    absolute = absolute.split('#')[0];

    if (!absolute.startsWith(BASE)) continue;

    links.add(absolute);
  }
  return links;
}

test.describe('SC21 - Full Site Link Health', () => {

  for (const { label, path } of SEED_PAGES) {
    test(`SC21 - No broken internal links on "${label}" page`, async ({ page, request, baseURL }) => {
      const BASE = baseURL.replace(/\/+$/, '');
      const links = await collectInternalLinks(page, path, BASE);

      const broken = [];
      for (const url of links) {
        let status;
        try {
          // Don't follow redirects — a 3xx means the link is alive; we only
          // care whether the server rejects the URL with a 4xx/5xx.
          const res = await request.get(url, { timeout: 15000, maxRedirects: 0 });
          status = res.status();
        } catch (e) {
          broken.push(`  • ${url}  →  ERROR: ${e.message.split('\n')[0]}`);
          continue;
        }
        if (status >= 400) {
          broken.push(`  • ${url}  →  HTTP ${status}`);
        }
      }

      expect(
        broken,
        `\n\nBroken links found on "${label}" (${path}):\n${broken.join('\n')}\n`
      ).toHaveLength(0);
    });
  }

});
