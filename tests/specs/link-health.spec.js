/**
 * SC21 - Full Site Link Health
 *
 * For each seed page, collects every unique internal <a href> and makes an
 * HTTP GET request to it. Any response >= 400 is reported as a failure.
 *
 * "Internal" means the resolved URL starts with https://www.foxbox.com.
 * External links (LinkedIn, feedback portals, etc.) are skipped.
 *
 * SC21 also dynamically crawls blog articles and case study detail pages
 * to catch broken links buried in content pages.
 */
const { test, expect } = require('@playwright/test');

const BASE = 'https://www.foxbox.com';

const SEED_PAGES = [
  { label: 'Home',                  path: '/' },
  { label: 'About',                 path: '/about/us' },
  { label: 'Culture',               path: '/about/culture' },
  { label: 'Approach',              path: '/approach' },
  { label: 'Blog',                  path: '/blog' },
  { label: 'Case Studies',          path: '/tags/case-studies' },
  { label: 'Healthcare',            path: '/healthcare' },
  { label: 'Product Lab',           path: '/services/product-lab' },
  { label: 'Product Maintenance',   path: '/services/product-maintenance' },
  { label: 'Staff Aug+',            path: '/services/staff-augmentation' },
  { label: 'Contact',               path: '/contact' },
  { label: 'Privacy',               path: '/privacy' },
];

/**
 * Visits an index page (blog or case studies) and returns all article URLs
 * matching the given CSS selector, resolved to absolute internal URLs.
 */
async function collectArticleUrls(page, indexPath, linkSelector) {
  await page.goto(`${BASE}${indexPath}`);
  await page.waitForLoadState('load');

  const hrefs = await page.locator(linkSelector).evaluateAll(
    anchors => anchors.map(a => a.getAttribute('href')).filter(Boolean)
  );

  const urls = new Set();
  for (const href of hrefs) {
    let absolute;
    if (href.startsWith('http')) {
      absolute = href;
    } else if (href.startsWith('/')) {
      absolute = `${BASE}${href}`;
    } else {
      continue;
    }
    absolute = absolute.split('#')[0];
    if (absolute.startsWith(BASE)) urls.add(absolute);
  }
  return urls;
}

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
    // Skip non-navigable schemes
    if (/^(mailto:|tel:|javascript:|#)/.test(href)) continue;

    // Resolve to absolute
    let absolute;
    if (href.startsWith('http')) {
      absolute = href;
    } else if (href.startsWith('/')) {
      absolute = `${BASE}${href}`;
    } else {
      continue;
    }

    // Strip fragment
    absolute = absolute.split('#')[0];

    // Internal only
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
          const res = await request.get(url, { timeout: 15000 });
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

  test('SC21 - No broken internal links on blog article pages', async ({ page, request }) => {
    // Collect all blog article URLs from the blog index (exclude pagination links)
    const articleUrls = await collectArticleUrls(
      page,
      '/blog',
      'a[href^="/blog/"]:not([href*="/page/"])'
    );

    // Collect all internal links from every article page, then check them
    const allLinks = new Set();
    for (const articleUrl of articleUrls) {
      const path = articleUrl.replace(BASE, '');
      const links = await collectInternalLinks(page, path);
      for (const link of links) allLinks.add(link);
    }

    const broken = [];
    for (const url of allLinks) {
      let status;
      try {
        const res = await request.get(url, { timeout: 15000 });
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
      `\n\nBroken links found across blog article pages:\n${broken.join('\n')}\n`
    ).toHaveLength(0);
  });

  test('SC21 - No broken internal links on case study pages', async ({ page, request }) => {
    // Collect all case study URLs from the case studies index
    const caseStudyUrls = await collectArticleUrls(
      page,
      '/tags/case-studies',
      'a[href^="/"][href*="case-stud"], a[href^="/blog/"]'
    );

    // Fall back to any article card links present on the index
    const allLinks = new Set();
    for (const csUrl of caseStudyUrls) {
      const path = csUrl.replace(BASE, '');
      const links = await collectInternalLinks(page, path);
      for (const link of links) allLinks.add(link);
    }

    const broken = [];
    for (const url of allLinks) {
      let status;
      try {
        const res = await request.get(url, { timeout: 15000 });
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
      `\n\nBroken links found across case study pages:\n${broken.join('\n')}\n`
    ).toHaveLength(0);
  });
});
