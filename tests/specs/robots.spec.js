/**
 * SC43 - robots.txt indexability guard (FOX2-154)
 *
 * FOX2-154: production was serving `Disallow: /` because VERCEL_ENV did not
 * resolve to 'production', so the whole site asked search engines not to index
 * it. This suite is the regression guard for that failure mode.
 *
 * A regression here is silent and expensive — the site stays up and looks fine
 * while it drops out of the index — so these assertions are deliberately blunt:
 * the blanket disallow must never come back.
 *
 * The shipped fix replaces the VERCEL_ENV check with a host-based deny-list:
 * localhost / 127.0.0.1 / staging.* / *.vercel.app are blocked, everything else
 * (including production) is allowed. The same logic gates the `X-Robots-Tag:
 * noindex` header in next.config.js.
 *
 * SC43 covers two sides, and they do NOT have equal power:
 *
 *   - ALLOW side, production (TC01-TC06) — these are the tests with teeth. A
 *     revert to the VERCEL_ENV logic makes them fail, because that logic
 *     evaluates to `disallow` on production. This is the FOX2-154 guard.
 *
 *   - DENY side, staging (TC07-TC08) — these CANNOT detect a revert. Broken code
 *     (`VERCEL_ENV === 'production' ? allow : disallow`) and fixed host-based
 *     code both yield `disallow` on staging, so staging looks correct either way.
 *     Verified 2026-08-03: staging serves `Disallow: /` + `X-Robots-Tag: noindex`
 *     while still running the unfixed code. What TC07-TC08 do catch is staging
 *     becoming *indexable* — a deny-list that stops matching `staging.*`.
 *
 * Consequence, worth stating because it is easy to assume otherwise: no test in
 * this file can pre-verify that the PR #245 fix reached the staging branch. That
 * check has to be source-level (grep VERCEL_ENV in src/pages/robots.txt.ts and
 * next.config.js) or a post-deploy curl against production. The production tests
 * here only fail AFTER a bad promotion has shipped — which is why the external
 * monitor (.github/workflows/indexing-monitor.yml) exists alongside them.
 *
 * Scope note: FOX2-86 (add indexable pages to XML sitemap) was CANCELED, so we
 * assert only that the Sitemap directive exists and resolves. We do not assert
 * anything about the sitemap's contents.
 */
const { test, expect } = require('@playwright/test');

// The deny side lives on a different host than baseURL, so it is asserted against
// this absolute URL rather than through the configured baseURL.
const STAGING_ORIGIN = 'https://staging.foxbox.com';

// A bare `Disallow: /` — the FOX2-154 failure. Must not match `Disallow: /studio`
// or any other scoped rule, so the line has to end right after the slash.
const BLANKET_DISALLOW = /^\s*Disallow:\s*\/\s*$/im;

test.describe('SC43 - robots.txt indexability (FOX2-154)', () => {
  let body;
  let status;

  test.beforeAll(async ({ request }) => {
    const res = await request.get('/robots.txt');
    status = res.status();
    body = await res.text();
  });

  test('SC43-TC01 - robots.txt is served with HTTP 200 and a non-empty body', async () => {
    expect(status, `/robots.txt returned HTTP ${status}`).toBe(200);
    expect(body.trim(), '/robots.txt is empty').not.toBe('');
  });

  test('SC43-TC02 - robots.txt does NOT contain a blanket "Disallow: /"', async () => {
    const offending = body
      .split('\n')
      .map((line, i) => ({ line: line.trim(), n: i + 1 }))
      .filter(({ line }) => BLANKET_DISALLOW.test(line))
      .map(({ line, n }) => `  line ${n}: "${line}"`);

    expect(
      offending,
      `\n\nFOX2-154 REGRESSION: production robots.txt is blocking the entire site.\n` +
        `This de-indexes www.foxbox.com. Check that VERCEL_ENV resolves to 'production'.\n` +
        `${offending.join('\n')}\n\nFull robots.txt:\n${body}\n`
    ).toHaveLength(0);
  });

  test('SC43-TC03 - robots.txt allows crawling of the site root', async () => {
    expect(
      body,
      `/robots.txt is missing an "Allow: /" directive.\n\nFull robots.txt:\n${body}`
    ).toMatch(/^\s*Allow:\s*\/\s*$/im);
  });

  test('SC43-TC04 - robots.txt declares a Sitemap directive', async () => {
    expect(
      body,
      `/robots.txt is missing a "Sitemap:" directive.\n\nFull robots.txt:\n${body}`
    ).toMatch(/^\s*Sitemap:\s*https?:\/\/\S+/im);
  });

  test('SC43-TC05 - the declared sitemap URL resolves successfully', async ({ request }) => {
    const match = body.match(/^\s*Sitemap:\s*(\S+)/im);
    expect(match, 'no Sitemap directive to follow').toBeTruthy();

    const sitemapUrl = match[1];
    // Follow redirects: robots.txt currently declares the apex host
    // (https://foxbox.com/sitemap.xml), which 308s to the www host. That hop is
    // acceptable — we only care that the URL ultimately serves a sitemap.
    const res = await request.get(sitemapUrl);
    expect(
      res.status(),
      `declared sitemap ${sitemapUrl} returned HTTP ${res.status()}`
    ).toBe(200);

    const xml = await res.text();
    expect(
      xml,
      `declared sitemap ${sitemapUrl} did not return XML sitemap markup`
    ).toMatch(/<(urlset|sitemapindex)\b/i);
  });

  test('SC43-TC06 - production does NOT send an X-Robots-Tag: noindex header', async ({ request }) => {
    // Second half of the FOX2-154 fix: the same fail-closed VERCEL_ENV check also
    // gated `X-Robots-Tag: noindex` in next.config.js. A correct robots.txt does
    // not help if the header still tells crawlers to skip the page.
    const res = await request.get('/');
    const header = res.headers()['x-robots-tag'];
    expect(
      header ?? '',
      `production sent "X-Robots-Tag: ${header}" — this de-indexes the page ` +
        `regardless of robots.txt (FOX2-154, next.config.js)`
    ).not.toMatch(/noindex/i);
  });
});

// Deny side of the host-based logic. Cross-host by design: these hit staging
// directly rather than the configured baseURL. Grep them out with
// `--grep-invert "SC43 - non-public host"` if staging is unavailable.
test.describe('SC43 - non-public host deny-list (FOX2-154)', () => {
  test('SC43-TC07 - staging robots.txt DOES block crawlers', async ({ request }) => {
    const res = await request.get(`${STAGING_ORIGIN}/robots.txt`);
    expect(res.status(), `staging /robots.txt returned HTTP ${res.status()}`).toBe(200);

    const body = await res.text();
    expect(
      body,
      `staging is NOT blocking crawlers — the host deny-list is not matching ` +
        `"staging.*", so staging content is indexable.\n\nstaging robots.txt:\n${body}`
    ).toMatch(/^\s*Disallow:\s*\/\s*$/im);
  });

  test('SC43-TC08 - staging sends X-Robots-Tag: noindex', async ({ request }) => {
    const res = await request.get(`${STAGING_ORIGIN}/`);
    const header = res.headers()['x-robots-tag'];
    expect(
      header ?? '',
      `staging did not send "X-Robots-Tag: noindex" (got "${header ?? 'no header'}") ` +
        `— the host deny-list in next.config.js is not matching "staging.*"`
    ).toMatch(/noindex/i);
  });
});
