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
    // Cards shown on the prod /case-studies index. Anthem and Home Chef have live
    // detail pages (see SC40) but are NOT surfaced on the index listing, so the
    // specific-card checks use Airspace and Freshpaint, which are listed.
    this.kHealthCard = page.getByText('K Health: Powering AI-Driven Healthcare').first();
    this.airspaceCard = page.getByText(/Airspace/i).first();
    this.versapayCard = page.getByText(/Versapay.*Mobile Strategy/i);
    this.freshpaintCard = page.getByText(/Freshpaint/i).first();

    // Case study cards — every card links to a /case-studies/<slug> detail page.
    // Used to measure how many cards the listing currently shows (for filter tests).
    this.cards = page.locator('a[href^="/case-studies/"]');

    // Filter trigger buttons. Filtering is client-side (no URL change); clicking a
    // button reveals its options. Industry/Offering options render as list items;
    // Technology options render as grouped text under HARDWARE / MOBILE / WEB headings.
    this.industryFilter = page.getByRole('button', { name: 'Industry', exact: true });
    this.offeringFilter = page.getByRole('button', { name: 'Offering', exact: true });
    this.technologyFilter = page.getByRole('button', { name: 'Technology', exact: true });
  }

  async open() {
    await this.navigate('/case-studies');
    await this.waitForPageLoad();
  }

  async cardCount() {
    return this.cards.count();
  }

  async openIndustryFilter() {
    await this.industryFilter.click();
    await this.page.waitForTimeout(500); // dropdown open animation
  }

  async openOfferingFilter() {
    await this.offeringFilter.click();
    await this.page.waitForTimeout(500);
  }

  async openTechnologyFilter() {
    await this.technologyFilter.click();
    await this.page.waitForTimeout(500);
  }

  // Industry/Offering options are list items — match the exact label and click.
  async selectListOption(label) {
    await this.page
      .getByRole('listitem')
      .filter({ hasText: new RegExp(`^${label}$`) })
      .first()
      .click();
    await this.page.waitForTimeout(1200); // allow the listing to re-filter
  }

  // Technology options are plain text nodes (not list items) — match exact text.
  async selectTechnologyOption(label) {
    await this.page.getByText(label, { exact: true }).first().click();
    await this.page.waitForTimeout(1200);
  }

  optionText(label) {
    return this.page.getByText(label, { exact: true }).first();
  }
}

module.exports = CaseStudiesPage;
