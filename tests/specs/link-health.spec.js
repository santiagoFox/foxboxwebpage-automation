/**
 * SC21 - Full Site Link Health
 *
 * For each seed page, collects every unique internal <a href> and makes an
 * HTTP GET request to it. Any response >= 400 is reported as a failure.
 * Redirects (3xx) are not followed — a redirect means the link is alive.
 *
 * "Internal" means the resolved URL starts with https://www.foxbox.com.
 * External links (LinkedIn, feedback portals, jobs.gem.com, etc.) are skipped.
 */
const { test, expect } = require('@playwright/test');

const BASE = 'https://www.foxbox.com';

const SEED_PAGES = [
  { label: 'Home',                path: '/' },
  { label: 'About',               path: '/about/us' },
  { label: 'Culture',             path: '/about/culture' },
  { label: 'Approach',            path: '/approach' },
  { label: 'Blog',                path: '/blog' },
  { label: 'Case Studies',        path: '/tags/case-studies' },
  { label: 'Healthcare',          path: '/healthcare' },
  { label: 'Product Lab',         path: '/product-lab' },
  { label: 'Product Maintenance', path: '/product-maintenance' },
  { label: 'Staff Aug+',          path: '/staff-aug' },
  { label: 'Contact',             path: '/contact' },
];

/**
 * Visits a page and returns the set of unique, normalised internal URLs
 * found in every <a href> on that page.
 */
async function collectInternalLinks(page, path) {
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
    test(`SC21 - No broken internal links on "${label}" page`, async ({ page, request }) => {
      const links = await collectInternalLinks(page, path);

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
