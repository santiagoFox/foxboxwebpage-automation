const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

// SC36 — FOX2-114: the team-members section on case study pages was changed from
// `flex flex-wrap` (rows misaligned by name length) to a CSS grid that shows 3
// columns on desktop and collapses responsively. The deployed app uses
// styled-components, so these tests assert COMPUTED layout (display:grid + track
// count) rather than the source-level `grid-cols-3` class, which never reaches
// the DOM. See CaseStudyDetailPage.getTeamGridMetrics().
test.describe('SC36 - Case Study Team Grid (FOX2-114)', () => {
  test('SC36-TC01 - Team section renders as a 3-column CSS grid on desktop', async ({ page, caseStudyDetailPage }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(caseStudyDetailPage.teamSectionHeading).toBeVisible();

    const metrics = await caseStudyDetailPage.getTeamGridMetrics();
    expect(metrics.headingFound, 'team section heading should be present').toBe(true);
    expect(metrics.gridFound, 'team section should use a CSS grid (FOX2-114) — found no display:grid container').toBe(true);
    expect(metrics.display).toBe('grid');
    expect(metrics.columns, `desktop should render 3 columns, got "${metrics.gridTemplateColumns}"`).toBe(3);
  });

  test('SC36-TC02 - Team grid collapses to fewer columns on mobile', async ({ page, caseStudyDetailPage }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const metrics = await caseStudyDetailPage.getTeamGridMetrics();
    expect(metrics.gridFound, 'team section should still use a CSS grid on mobile').toBe(true);
    expect(metrics.display).toBe('grid');
    expect(metrics.columns, `mobile should render fewer than 3 columns, got "${metrics.gridTemplateColumns}"`).toBeLessThan(3);
  });
});
