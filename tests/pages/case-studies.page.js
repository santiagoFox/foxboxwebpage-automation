const BasePage = require('./base.page');

class CaseStudiesPage extends BasePage {
  constructor(page) {
    super(page);

    // Page heading / meta
    this.pageHeading = page.getByRole('heading', { name: /case studies/i }).first();
    this.postCount = page.getByText(/\d+ posts tagged with/i);

    // Case study cards (partial text matches for resilience)
    this.kHealthCard = page.getByText('K Health: Powering AI-Driven Healthcare').first();
    this.airspaceCard = page.getByText('Airspace Data: Delivering a Properly Calibrated MVP');
    this.versapayCard = page.getByText(/Versapay.*Mobile Strategy/i);
    this.homeChefCard = page.getByText(/Home Chef/i).first();

    // Browse all tags link
    this.browseAllTagsLink = page.getByRole('link', { name: /Browse all tags/i });
  }

  async open() {
    await this.navigate('/tags/case-studies');
    await this.waitForPageLoad();
  }
}

module.exports = CaseStudiesPage;
