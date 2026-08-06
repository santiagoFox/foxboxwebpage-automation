const BasePage = require('./base.page');

class CaseStudiesPage extends BasePage {
  constructor(page) {
    super(page);

    // Page heading — the h1 on /case-studies. Reverted to the plain "Case Studies"
    // title (observed live 2026-08-06); it had briefly been the tagline "What we've
    // built and how we've built it" after the /tags/case-studies → /case-studies
    // migration. Pinned to level 1 so it can never match a case-study card <h3>.
    this.pageHeading = page
      .getByRole('heading', { name: /^case studies$/i, level: 1 })
      .first();

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
