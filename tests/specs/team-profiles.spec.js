const { test } = require('../fixtures/fixtures');
const {
  assertPermanentRedirect,
  assertRedirectResolves,
  assertPageLive,
} = require('../utils/http');

// SC37 — FOX2-101: five orphaned team profile pages (still indexed by Google but no
// longer linked) now permanently redirect to /about/us. Two profiles stay live.
//
// KNOWN GAP (per qa-deploy-2026-07-20.md): the 5 profiles are not yet hidden:true in
// Sanity, so they may still appear on the /about/us team section — tracked separately,
// intentionally NOT asserted here.

const REDIRECTED_PROFILES = [
  '/team-profiles/amelia-leigner',
  '/team-profiles/fernando-schuindt',
  '/team-profiles/leticia-zampieri',
  '/team-profiles/kelsey-pierson',
  '/team-profiles/matt-chen',
];

const ACTIVE_PROFILES = [
  '/team-profiles/rob-volk',
  '/team-profiles/elliott-torres',
];

const pad = (n) => String(n).padStart(2, '0');

test.describe('SC37 - Orphaned team profile redirects (FOX2-101)', () => {
  REDIRECTED_PROFILES.forEach((from, i) => {
    test(`SC37-TC${pad(i + 1)} - ${from} permanently redirects to /about/us`, async ({ request }) => {
      await assertPermanentRedirect(request, from, '/about/us');
    });
  });

  REDIRECTED_PROFILES.forEach((from, i) => {
    test(`SC37-TC${pad(i + 6)} - ${from} follows through to /about/us with no redirect loop`, async ({ page }) => {
      await assertRedirectResolves(page, from, '/about/us');
    });
  });

  ACTIVE_PROFILES.forEach((path, i) => {
    test(`SC37-TC${pad(i + 11)} - ${path} is still live (HTTP 200)`, async ({ page }) => {
      await assertPageLive(page, path);
    });
  });
});
