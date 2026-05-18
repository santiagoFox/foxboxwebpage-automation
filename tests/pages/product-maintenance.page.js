const BasePage = require('./base.page');

class ProductMaintenancePage extends BasePage {
  constructor(page) {
    super(page);

    // Hero section
    this.heroHeading = page.getByText('Foxbox is on it.');

    // Section headings
    this.proactiveMaintenanceHeading = page.getByText('Proactive Maintenance');
    this.predictableSupportHeading = page.getByText('Predictable Support');
    this.peaceOfMindHeading = page.getByText('Peace of Mind');
    this.versapayHeading = page.getByText("Versapay's Mobile Strategy");
    this.craveMoreHeading = page.getByText(/Craving more predictability/i);

    // Case study link
    this.versapayCaseStudyLink = page.getByRole('link', { name: /Read more/i }).first();

    // Mobile app maintenance link
    this.mobileAppMaintenanceLink = page.getByRole('link', { name: /GO TO MOBILE APP MAINTENANCE/i });

    // CTA
    this.letsChatLink = page.getByRole('link', { name: /Let.?s chat/i }).first();

    // Newsletter (footer)
    this.newsletterInput = page.getByPlaceholder(/enter your email/i);
    this.newsletterSignUpButton = page.getByRole('button', { name: /SIGN UP/i });
  }

  async open() {
    await this.navigate('/services/product-maintenance');
    await this.waitForPageLoad();
  }
}

module.exports = ProductMaintenancePage;
