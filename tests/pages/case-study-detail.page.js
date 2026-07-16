const BasePage = require('./base.page');

// Case study detail (blog) page. FOX2-114 replaced the team-members section's
// `flex flex-wrap` layout with a CSS grid (grid-cols-3 on desktop) so that rows
// stay aligned regardless of name length. The deployed app uses styled-components
// (hashed class names), so this page object asserts on COMPUTED layout rather than
// the source-level `grid-cols-3` class, which never reaches the DOM.
class CaseStudyDetailPage extends BasePage {
  // Canonical case study used for the team-grid checks. Case studies live under
  // the /case-studies/ route; K Health is the reference page that renders the
  // CaseStudyTeam "The team" section.
  static DEFAULT_PATH = '/case-studies/k-health-ai-healthcare-case-study';

  constructor(page) {
    super(page);

    // The CaseStudyTeam component is introduced by "The team" heading.
    this.teamSectionHeading = page.getByRole('heading', { name: /^the team$/i }).first();
  }

  async open(path = CaseStudyDetailPage.DEFAULT_PATH) {
    await this.navigate(path);
    await this.waitForPageLoad();
  }

  /**
   * Measures the computed layout of the team-members grid inside the
   * CaseStudyTeam section. Anchors on the "bright minds" heading, then picks the
   * grid container with the most children (the member grid). Re-reads computed
   * style on every call, so it can be called again after a viewport change to
   * verify responsive behaviour. Returns diagnostic flags instead of throwing so
   * the spec can produce clear failure messages.
   */
  async getTeamGridMetrics() {
    return await this.page.evaluate(() => {
      const heads = [...document.querySelectorAll('h2, h3, h4')];
      const heading = heads.find((h) => /^the team$/i.test((h.textContent || '').trim()));
      if (!heading) return { headingFound: false, gridFound: false };

      const section = heading.closest('section') || heading.parentElement;
      const candidates = [...section.querySelectorAll('*')].filter((el) => {
        const display = getComputedStyle(el).display;
        return (display === 'grid' || display === 'inline-grid') && el.childElementCount >= 2;
      });
      // The member grid is the grid container holding the most cards.
      candidates.sort((a, b) => b.childElementCount - a.childElementCount);
      const grid = candidates[0];
      if (!grid) return { headingFound: true, gridFound: false };

      const cs = getComputedStyle(grid);
      const columns = cs.gridTemplateColumns.split(' ').filter(Boolean).length;
      return {
        headingFound: true,
        gridFound: true,
        display: cs.display,
        columns,
        gridTemplateColumns: cs.gridTemplateColumns,
        memberCount: grid.childElementCount,
      };
    });
  }
}

module.exports = CaseStudyDetailPage;
