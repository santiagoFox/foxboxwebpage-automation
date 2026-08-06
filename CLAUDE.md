# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Playwright E2E automation suite for **https://foxbox.com** — the Foxbox Digital agency website.
The apex is the canonical host since FOX2-155 (2026-08-05); `www` 308s to it, and the suite's
`baseURL` points at the apex.

- **Framework**: Playwright v1.59+ with Chromium, viewport 1440×900
- **Pattern**: Page Object Model (POM)
- **Config**: `fullyParallel: false`, `retries: 1`, `timeout: 60s`, `expect timeout: 15s`

---

## Commands

```bash
npm test                    # Run all tests headless
npm run test:headed         # Run with browser visible
npm run test:debug          # Run in debug/step mode
npm run report              # Open HTML report from reports/html/

# Run a single spec file
npx playwright test tests/specs/home.spec.js

# Run tests matching a pattern (suite or test name)
npx playwright test --grep "SC01"
npx playwright test --grep "Footer"

# Run a single test by title
npx playwright test --grep "SC11-TC07"
```

---

## Directory structure

```
tests/
  specs/       ← spec files (home, navigation, about, blog, case-studies)
  pages/       ← page object classes (base.page.js + one per page)
  fixtures/    ← fixtures.js (extends test with page fixtures)
data/          ← testData.js (expected strings/values for assertions)
scripts/       ← check-indexing.mjs (standalone, no deps — see CI/CD)
playwright.config.js
```

`data/` is at the project root, not inside `tests/`.

---

## Architecture

### How the pieces connect

1. **`tests/fixtures/fixtures.js`** — extends Playwright's base `test` with four fixtures: `homePage`, `aboutPage`, `blogPage`, and `caseStudiesPage`. Each fixture instantiates the corresponding page class, calls `open()`, and injects the iframe style tag. All spec files import `{ test }` from here instead of from `@playwright/test`.

2. **`tests/pages/base.page.js`** — `BasePage` holds the `page` reference and exposes `navigate()`, `scrollToElement()`, `isVisible()`, and `waitForPageLoad()` (uses `load` state).

3. **`tests/pages/home.page.js`** — `HomePage extends BasePage`. All locators are defined in the constructor; action methods (click, fill, expand) live here. Navigation tests drive the menu entirely through `HomePage` methods and locators.

4. **`tests/pages/about.page.js`**, **`tests/pages/blog.page.js`**, **`tests/pages/case-studies.page.js`** — additional page classes following the same pattern: locators in constructor, `open()` navigates to the page URL.

5. **`data/testData.js`** — single source of truth for expected strings (headings, article titles, copyright). Import and use these in assertions rather than hardcoding strings in specs.

6. **`playwright.config.js`** — `testDir` points to `./tests/specs`. Reports go to `reports/html/`. Screenshots, video, and trace are captured only on failure.

### Spec files and test ID convention

Test IDs follow `SC<suite>-TC<case>` format. Use `--grep "SC12"` to run a whole suite or `--grep "SC12-TC01"` for a single test.

**`tests/specs/home.spec.js`** — SC01–SC11:
- SC01: Header/Nav (logo, hamburger, page title)
- SC02: Hero section
- SC03: Welcome section
- SC04: Case studies (K Health, X Company, Home Chef) + links
- SC05: Testimonial section
- SC06: Services accordions (expand/collapse, CSS height assertion, Learn More nav)
- SC07: Inside the Box blog (TC02–TC04 assert first/second/third article title by position; TC05–TC08 assert count and URL patterns)
- SC08: What We Believe (6 beliefs, Why We Do button → /about)
- SC09: Trusted to Deliver (5 client logos)
- SC10: CTA section
- SC11: Footer (newsletter, copyright, privacy policy, social links)

**`tests/specs/navigation.spec.js`** — SC12–SC16:
- SC12: Menu open/close (hamburger, Escape key, LET'S CHAT, Follow Us)
- SC13: COMPANY links (About Us, Our Work, Inside the Box)
- SC14: SOLUTIONS links (Product Lab, Product Maintenance, Staff Aug+, Healthcare)
- SC15: WORK links (See All Case Studies, Airspace, Versapay, Anthem)
- SC16: Footer navigation links — asserts `href` attribute values (About, Blog, Careers, Approach, Culture, Product Lab, Product Maintenance, Staff Aug+, Privacy Policy, LinkedIn)
- SC20: Footer link health — makes an HTTP GET request to every footer link href and asserts status < 400 (catches broken/404 links in nightly runs)
- SC41: Nav case-study link hrefs (FOX2-129) — asserts Our Work + See All Case Studies point to `/case-studies` and the K Health/Versapay/Anthem featured links point under `/case-studies/*`

**`tests/specs/about.spec.js`** — SC17:
- SC17: About page (WHO WE ARE heading, hero heading/subheading, leadership team cards, WHY FOXBOX? section, CHAT WITH US CTA, What We Believe, newsletter)

**`tests/specs/blog.spec.js`** — SC18:
- SC18: Blog page (Inside the Box heading, subheading, article count ≥ 3, first/second/third article title, Read More URL pattern, clicking first article navigates, pagination Next link, newsletter)

**`tests/specs/case-studies.spec.js`** — SC19:
- SC19: Case Studies page (page heading, K Health/Anthem/Versapay/Home Chef cards, clicking K Health card navigates)

### Production deploy verification (qa-deploy-2026-07-20)

These suites verify the case-study migration + content-cleanup deploy. Redirect
assertions live in **`tests/utils/http.js`** (`assertPermanentRedirect`,
`assertRedirectResolves`, `assertPageLive`).

- **`tests/specs/team-profiles.spec.js`** — SC37 (FOX2-101): 5 orphaned `/team-profiles/*` permanently redirect to `/about/us` (no loop); `rob-volk` + `elliott-torres` stay live.
- **`tests/specs/tag-redirects.spec.js`** — SC38 (FOX2-102): `/tags/case-studies` → `/case-studies`; 11 retired tags + `/tags` index → `/blog`; active tag stays live.
- **`tests/specs/case-study-redirects.spec.js`** — SC39 + SC40 (FOX2-94): 12 old `/blog/*` case-study URLs → `/case-studies/*` (SC39); 13 detail pages + index live (SC40).
- **`tests/specs/case-study-filters.spec.js`** — SC42 (FOX2-94): Industry/Offering/Technology filters open, list renamed + Hardware-group taxonomies, and narrow the listing without errors.

**Redirect status codes**: the server issues **HTTP 308**. `PERMANENT_REDIRECT_CODES`
in `tests/utils/http.js` accepts `[301, 308]`; narrow it to `[308]` to make it strict.

**Reliability**: never gate on a raw 200 from `request.get()` — this site soft-404s
(HTTP 200 + "Page Not Found" body) and some live pages 404 to a raw GET. `assertPageLive`
gates on the rendered "Page Not Found" UI instead. Redirect *status* from `request.get(..., {maxRedirects: 0})` is reliable (edge/CDN).

### Adding new page coverage

- New page classes should extend `BasePage`, define all locators in the constructor, and implement `open()`.
- Register a new fixture in `fixtures.js` (instantiate, call `open()`, inject iframe style tag).
- Add expected strings to `data/testData.js`; reference them in specs rather than hardcoding.

---

## Locator strategy — priority order

1. `getByRole(role, { name })` — most preferred
2. `getByText(text)` / `getByAltText(text)` — for content assertions or image alts
3. `getByPlaceholder(text)` — for form inputs
4. `locator('css selector')` — fallback (e.g. `.accordion-item-content`)

Avoid XPath. Scope ambiguous locators with `page.locator('footer')` or use `.first()` / `.nth()`.

---

## Key Locator Notes

- **Hamburger button**: `page.getByRole('button', { name: 'Menu' })` — the SVG has `<title>Menu</title>`
- **Curly apostrophes/quotes**: Use regex wildcard — e.g. `getByText(/Build what you couldn.t have/)`
- **COMPANY/SOLUTIONS/WORK headers**: `getByText('COMPANY')` matches too broadly (hits "The X Company" text) — target the individual nav links instead
- **FOLLOW US**: Exists in both footer and nav menu — scope with `page.locator('footer')` or use `.last()` on `span` filter
- **Menu close**: `page.keyboard.press('Escape')` — no reliable close button selector
- **Duplicate link names** (Product Lab, Product Maintenance, Staff Aug+): footer and nav both have these — use `.first()` for nav, scope with `page.locator('footer')` for footer
- **Accordion collapsed state**: Use `toHaveCSS('height', '0px')` on content container — `toBeVisible()` won't detect hidden-via-CSS-height elements
- **Menu animation waits**: `openNavMenu()` waits 500ms; other menu methods wait 300ms; `Escape` close waits 400ms — don't remove these or tests will flake
- **Blog article title locators** (`firstArticleTitle`, `secondArticleTitle`, `thirdArticleTitle`) use positional structural selectors — `aside a[aria-label^="Read more about"]` on the homepage and `article h3` on `/blog` — so they survive article rotations without any code changes

---

## Actual Navigation URLs

| Menu Link | URL pattern |
|---|---|
| About Us | `/about` → **307** → `/about/us` (see 307 note below) |
| Our Work | `/case-studies` (FOX2-129 — migrated from `/tags/case-studies`) |
| Inside the Box | `/blog` |
| Careers | `jobs.gem.com/foxbox-digital` (external) |
| Product Lab | `/services/product-lab` |
| Product Maintenance | `/services/product-maintenance` |
| Staff Aug+ | `/services/staff-augmentation` |
| Healthcare | `/services/healthcare` |
| Services index | `/services` |
| AI Native Assessment | `/ai-native-assessment` |
| K Health: AI Healthcare | `/case-studies/*k-health*` (FOX2-94 — was `/blog/*`) |
| Versapay | `/case-studies/*versapay*` (FOX2-94 — was `/blog/*`) |
| Anthem | `/case-studies/*anthem*` (FOX2-94 — was `/blog/*`) |

**`/services/*` migration (verified 2026-07-31)**: the four solution pages moved under
`/services/` and Staff Aug+ was also renamed (`/staff-aug` → `/services/staff-augmentation`).
Page objects were already updated; this table, the SC21 seed list, and the SC14-TC04 URL
assertion were not. The **old URLs are hard 404s, not redirects** — no `/product-lab`,
`/product-maintenance`, `/staff-aug`, or `/healthcare` redirect exists. Likely FOX2-71 scope.

**307 on `/about`**: `/about` serves an HTTP **307 (temporary)** redirect to `/about/us`.
FOX2-60 ("change temporary 302 → permanent 301") is marked Done, so this route either
missed the fix or is generated at the framework level. Unresolved — do not codify 307 as
expected until confirmed.

---

## Fixtures Note

`fixtures.js` injects `pointer-events: none` on all iframes after page load to disable the Intercom chat overlay, which otherwise intercepts clicks in tests.

---

## CI/CD

**`.github/workflows/nightly.yml`** — runs nightly at 00:00 UTC and on manual dispatch:
1. Installs Node 20, runs `npm ci`, installs Chromium
2. Runs `npm test`
3. Uploads HTML report as a 30-day artifact; uploads `test-results/` on failure (7 days)
4. Posts pass/fail Slack notification via incoming webhook

**`.github/workflows/indexing-monitor.yml`** — runs **hourly** (`:17`) and on manual dispatch.
Implements **FOX2-156**. Runs `scripts/check-indexing.mjs`, alerts Slack, fails the job.

**Two independent mechanisms** — they catch different things, neither replaces the other:

1. **Assertions** (default mode) — "is production in a known-good state?" Gating failures
   page the on-call handle. Narrow, near-zero false positives.
2. **Snapshot + diff** (`--snapshot`) — "did anything change?" Reports before/after for any
   change to robots.txt or `X-Robots-Tag`, including changes no assertion anticipates.
   Non-paging: a scoped `Disallow: /new-path` is a legitimate edit. The workflow commits
   `snapshots/indexing-state.json`, so its git history is the audit trail June lacked.

Snapshot output is deliberately **deterministic** — no timestamps, CRLF normalised. Anything
varying per request would diff hourly and train everyone to ignore the alert.

**Manual dispatch inputs**: `test_alert` sends a harmless test message (proves webhook
delivery only, no ping); `force_failure` fires a **real** gating alert as a drill, which is
how FOX2-156's "confirm the alert fires by deliberately triggering it once" is satisfied.

**Runbook**: `docs/runbooks/indexing-alert.md`, linked from every alert. Required by
FOX2-156's acceptance criteria.

Separate from the nightly on purpose: the nightly's single pass/fail Slack line makes a
deindexing event indistinguishable from a flaky locator.

**Config**: secret **`SLACK_WEBHOOK_URL_INDEXING`** (required, distinct from
`SLACK_WEBHOOK_URL`; points at `#foxbox-webpage-nightly`). Repo var **`ALERT_MENTION`**
(optional) sets who gets paged on gating failures — defaults to `<!here>`, but FOX2-156 asks
for an accountable team, so prefer a group handle like `<!subteam^S0123|web-oncall>`.

**`schedule` only fires on the default branch**, so this does nothing until merged to
`main` — and `workflow_dispatch` isn't runnable until the file is on `main` either.

`scripts/check-indexing.mjs` is **dependency-free and browser-free** — no `npm ci`, no
Playwright install, just `fetch`. Keep it that way; its value is that it survives breakage
in the rest of the repo's tooling. Run it locally with `npm run monitor` (or
`node scripts/check-indexing.mjs foxbox --json`).

It asserts expected state rather than diffing, and covers all three production sites plus
the inverted staging check. Canonical hosts differ per site and are declared individually:

| Site | Canonical host | Non-canonical |
|---|---|---|
| foxbox.com | `foxbox.com` (apex) | www 308 → apex (FOX2-155, 2026-08-05) |
| stormwindstudios.com | `stormwindstudios.com` (apex) | www 301 → apex |
| signallabs.ai | `www.signallabs.ai` | not asserted |

**Two failure tiers.** `gate` fails the job and pages Slack — reserved for the deindexing
class (blanket `Disallow: /`, `noindex` header). `warn` is reported in the run summary and
artifact but pages nobody. Warnings do not affect the exit code.

The tiers exist because of **FOX2-155**: the canonical checks failed on production until
2026-08-05, so shipping them as gating would have made the monitor red on its first run, and a
monitor that is red on arrival gets muted. **FOX2-155 landed 2026-08-05 — the apex is now
canonical and the canonical checks pass**, so `CANONICAL_TIER` is ready to promote to `'gate'`
(kept `'warn'` in the host-flip change; promote as a fast follow once a green run confirms it).

**FOX2-155 root cause (confirmed 2026-07-31 via Ahrefs Site Audit, 261/261 rows)**: every
`www.foxbox.com` page returns 200 with `rel=canonical` pointing at the **apex** host and the
same path; the apex then 308s back to www. Canonical-points-to-redirect ⇒ Google treats all
261 pages as non-indexable. The apex→www 308 is correct; the **canonical tag** is wrong.
Almost certainly one shared base-URL constant set to `foxbox.com` — the same apex host also
appears in robots.txt's `Sitemap:` directive. Not a Vercel redirect misconfiguration.

Canonical checks are **sampled, not exhaustive** (root + 2 templates for foxbox). The defect
is generated from one constant, so it is uniform site-wide and sampling detects it as
reliably as crawling every page. Ahrefs stays the tool for full-site coverage.

**Relationship to SC43**: the Playwright spec and the monitor overlap deliberately. SC43
fails a test run; the monitor pages a channel hourly and keeps working if the suite breaks.
Neither can pre-verify that a fix reached a branch — see the header of `robots.spec.js`.

---

## Pending Scenarios

- Responsive / mobile viewport tests
