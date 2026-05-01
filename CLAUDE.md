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

## Architecture

### How the pieces connect

1. **`tests/fixtures/fixtures.js`** — extends Playwright's base `test` with a `homePage` fixture that auto-instantiates `HomePage` and calls `homePage.open()` before each test. All spec files import `{ test }` from here instead of from `@playwright/test`.

2. **`tests/pages/base.page.js`** — `BasePage` holds the `page` reference and exposes `navigate()`, `scrollToElement()`, `isVisible()`, and `waitForPageLoad()` (uses `load` state).

3. **`tests/pages/home.page.js`** — `HomePage extends BasePage`. All locators are defined in the constructor; action methods (click, fill, expand) live here. Navigation tests drive the menu entirely through `HomePage` methods and locators.

4. **`data/testData.js`** — single source of truth for expected strings (headings, article titles, copyright). Import and use these in assertions rather than hardcoding strings in specs.

5. **`playwright.config.js`** — `testDir` points to `./tests/specs`. Reports go to `reports/html/`. Screenshots, video, and trace are captured only on failure.

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
- SC12: Menu open/close (hamburger, Escape key, LET'S CHAT, address, Follow Us)
- SC13: COMPANY links (About Us, Our Work, Inside the Box)
- SC14: SOLUTIONS links (Product Lab, Product Maintenance, Staff Aug+, Healthcare)
- SC15: WORK links (See All Case Studies, Airspace, Versapay, Anthem)
- SC16: Footer navigation links (About, Blog, Careers, Approach, Culture, all service pages, Privacy Policy, LinkedIn)

### Adding new page coverage

- New page classes should extend `BasePage`.
- Add new locators and action methods to the relevant page class.
- Add a new fixture property in `fixtures.js` if a new page needs auto-setup.
- Add expected strings to `data/testData.js`; reference them in specs.

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
- **Blog article title locators** (`firstArticleTitle`, `secondArticleTitle`, `thirdArticleTitle`) in both `home.page.js` and `blog.page.js` are hardcoded to the current top-3 articles — update them (and `data/testData.js` `blog.articles`) whenever the site's article list rotates
- **Homepage article titles appear twice in DOM** (responsive layout duplication) — locators in `home.page.js` use `.first()` to avoid strict mode violations; `blog.page.js` does not need this since `/blog` does not duplicate them

---

## Actual Navigation URLs

| Menu Link | URL pattern |
|---|---|
| About Us | `/about` |
| Our Work | `/tags/case-studies` |
| Inside the Box | `/blog` |
| Careers | `jobs.gem.com/foxbox-digital` (external) |
| Product Lab | `/product-lab` |
| Product Maintenance | `/product-maintenance` |
| Staff Aug+ | `/staff-aug` |
| Healthcare | `/healthcare` |
| Airspace Data | URL contains `airspace` |
| Versapay | URL contains `versapay` |
| Anthem | URL contains `anthem` |

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
