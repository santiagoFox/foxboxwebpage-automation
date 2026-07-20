# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Playwright E2E automation suite for **https://www.foxbox.com** — the Foxbox Digital agency website.

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
| About Us | `/about` |
| Our Work | `/case-studies` (FOX2-129 — migrated from `/tags/case-studies`) |
| Inside the Box | `/blog` |
| Careers | `jobs.gem.com/foxbox-digital` (external) |
| Product Lab | `/product-lab` |
| Product Maintenance | `/product-maintenance` |
| Staff Aug+ | `/staff-aug` |
| Healthcare | `/healthcare` |
| K Health: AI Healthcare | `/case-studies/*k-health*` (FOX2-94 — was `/blog/*`) |
| Versapay | `/case-studies/*versapay*` (FOX2-94 — was `/blog/*`) |
| Anthem | `/case-studies/*anthem*` (FOX2-94 — was `/blog/*`) |

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

---

## Pending Scenarios

- Responsive / mobile viewport tests
