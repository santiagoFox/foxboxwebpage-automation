const BasePage = require('./base.page');

class CaseStudiesPage extends BasePage {
  constructor(page) {
    super(page);

    // Page heading. The old Drupal tag page (/tags/case-studies) was migrated to
    // /case-studies; the heading is now this tagline (was "case studies"), and the
    // "N posts tagged with" count + "Browse all tags" link were removed.
    this.pageHeading = page
      .getByRole('heading', { name: /what we.ve built and how we.ve built it/i })
      .first();

    // Case study cards (partial text matches for resilience). Airspace is no
    // longer in the listing; Anthem covers that slot.
    this.kHealthCard = page.getByText('K Health: Powering AI-Driven Healthcare').first();
    this.anthemCard = page.getByText(/Anthem/i).first();
    this.versapayCard = page.getByText(/Versapay.*Mobile Strategy/i);
    this.homeChefCard = page.getByText(/Home Chef/i).first();
  }

  async open() {
    await this.navigate('/case-studies');
    await this.waitForPageLoad();
  }
}

module.exports = CaseStudiesPage;
