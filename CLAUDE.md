# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Playwright E2E automation suite for **https://www.foxbox.com** — the Foxbox Digital agency website.

- **Framework**: Playwright v1.59+ with Chromium, viewport 1440×900
- **Pattern**: Page Object Model (POM)
- **Config**: `fullyParallel: false`, `retries: 1`, `timeout: 30s`, `expect timeout: 10s`

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

2. **`tests/pages/base.page.js`** — `BasePage` holds the `page` reference and exposes `navigate()`, `scrollToElement()`, `isVisible()`, and `waitForPageLoad()` (uses `networkidle`).

3. **`tests/pages/home.page.js`** — `HomePage extends BasePage`. All locators are defined in the constructor; action methods (click, fill, expand) live here. Navigation tests drive the menu entirely through `HomePage` methods and locators.

4. **`data/testData.js`** — single source of truth for expected strings (headings, article titles, copyright). Import and use these in assertions rather than hardcoding strings in specs.

5. **`playwright.config.js`** — `testDir` points to `./tests/specs`. Reports go to `reports/html/`. Screenshots, video, and trace are captured only on failure.

### Adding new page coverage

- New page classes should extend `BasePage`.
- Add new locators and action methods to the relevant page class.
- Add a new fixture property in `fixtures.js` if a new page needs auto-setup.
- Add expected strings to `data/testData.js`; reference them in specs.

---

## Key Locator Notes

- **Hamburger button**: `page.getByRole('button', { name: 'Menu' })` — the SVG has `<title>Menu</title>`
- **Curly apostrophes/quotes**: Use regex wildcard — e.g. `getByText(/Build what you couldn.t have/)`, `/Beyond the .95% Failure. Myth/`
- **COMPANY/SOLUTIONS/WORK headers**: `getByText('COMPANY')` matches too broadly (hits "The X Company" text) — target the individual nav links instead
- **FOLLOW US**: Exists in both footer and nav menu — scope with `page.locator('footer')` or use `.last()` on `span` filter
- **Menu close**: `page.keyboard.press('Escape')` — no reliable close button selector
- **Duplicate link names** (Product Lab, Product Maintenance, Staff Aug+): footer and nav both have these — use `.first()` for nav, scope with `page.locator('footer')` for footer

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
| AI Readiness Assessment | `/assessment` |
| Airspace Data | URL contains `airspace` |
| Versapay | URL contains `versapay` |
| Anthem | URL contains `anthem` |

---

## Pending Scenarios

- Footer navigation link tests (Contact us, About, Blog, Careers, Approach, Culture, Services links, Privacy Policy)
- Newsletter signup validation (valid email, invalid email, empty submit)
- Case study "SEE THE CASE STUDY" link navigation
- "WHY WE DO WHAT WE DO" button navigation
- Testimonial "READ MORE" navigation
- Logo click returns to home
- Responsive / mobile viewport tests
