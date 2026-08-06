const { expect } = require('@playwright/test');

// Shared HTTP/redirect assertions for the production deploy verification
// (qa-deploy-2026-07-20.md — FOX2-101, FOX2-102, FOX2-94).

// Accepted permanent-redirect status codes.
//
// NOTE(301-vs-308): the deploy doc contradicts itself — the "What changed" prose
// describes these as "301" redirects, but every "What to test" checklist says
// HTTP 308. Both are permanent redirects. Pending confirmation from the dev we
// accept either. To make the assertion strict (e.g. exactly 308), narrow this
// array to a single value — nothing else needs to change.
const PERMANENT_REDIRECT_CODES = [301, 308];

// Canonical/serving host is the apex (FOX2-155, landed 2026-08-05); www 308s to it.
const PROD_HOST = 'foxbox.com';

// Normalize any Location value (absolute or relative) to a bare pathname with no
// trailing slash, so "/blog", "/blog/" and "https://foxbox.com/blog" compare equal.
function pathnameOf(location) {
  try {
    return new URL(location, `https://${PROD_HOST}`).pathname.replace(/\/+$/, '') || '/';
  } catch {
    return location;
  }
}

// Assert `fromPath` issues a permanent redirect whose Location resolves to `expectedPath`.
//
// Uses maxRedirects:0 to capture the redirect hop itself. The redirect is issued at
// the edge/CDN and is reliable — unlike a raw 200 GET, which this site can soft-404
// (see the reliability note in content-cleanup.spec.js), so we never gate on a 200
// from APIRequestContext.
async function assertPermanentRedirect(request, fromPath, expectedPath) {
  const res = await request.get(fromPath, { maxRedirects: 0 });
  const status = res.status();
  expect(
    PERMANENT_REDIRECT_CODES,
    `${fromPath} returned HTTP ${status} — expected a permanent redirect (${PERMANENT_REDIRECT_CODES.join(' or ')})`
  ).toContain(status);

  const location = res.headers()['location'];
  expect(location, `${fromPath} redirect is missing a Location header`).toBeTruthy();

  // When the Location is absolute it must point at the production host.
  if (/^https?:\/\//i.test(location)) {
    expect(
      new URL(location).host,
      `${fromPath} redirected off-host to ${location}`
    ).toBe(PROD_HOST);
  }

  expect(
    pathnameOf(location),
    `${fromPath} redirected to "${location}", expected pathname "${expectedPath}"`
  ).toBe(expectedPath);
}

// Follow the full redirect chain in a real browser. A redirect loop surfaces as a
// navigation error (ERR_TOO_MANY_REDIRECTS) and fails the test; on success the
// browser must land on `expectedPath`.
async function assertRedirectResolves(page, fromPath, expectedPath) {
  await page.goto(fromPath, { waitUntil: 'domcontentloaded' });
  expect(
    pathnameOf(page.url()),
    `${fromPath} landed on ${page.url()}, expected ${expectedPath}`
  ).toBe(expectedPath);
}

// Assert a path is a live page. Gate on rendered content, not raw HTTP status:
// this site serves soft-404s (HTTP 200 + a "Page Not Found" body) and some live
// pages 404 to a raw GET, so the rendered "Page Not Found" UI is the reliable
// signal. The nav HTTP status is captured only for the failure message.
async function assertPageLive(page, path) {
  const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
  const status = resp ? resp.status() : 'n/a';
  await expect(
    page.getByText(/page not found/i),
    `${path} rendered a "Page Not Found" page (nav HTTP ${status}) — expected a live page`
  ).not.toBeVisible();
  // It must also not have been redirected away from the requested path.
  expect(
    pathnameOf(page.url()),
    `${path} redirected to ${page.url()} — expected it to stay live at ${path}`
  ).toBe(pathnameOf(path));
}

module.exports = {
  PERMANENT_REDIRECT_CODES,
  pathnameOf,
  assertPermanentRedirect,
  assertRedirectResolves,
  assertPageLive,
};
