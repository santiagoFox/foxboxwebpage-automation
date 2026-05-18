const BasePage = require('./base.page');

class StaffAugmentationPage extends BasePage {
  constructor(page) {
    super(page);

    // Hero section
    this.heroHeading = page.getByRole('heading', { name: 'Staff Aug+' }).first();
    this.heroSubheading = page.getByText('Get the hands-on help you need.');

    // Section headings
    this.crossFunctionalHeading = page.getByText('Cross-Functional Talent');
    this.scalableDeliveryHeading = page.getByText('Scalable Delivery');
    this.proactiveOversightHeading = page.getByText('Proactive Oversight');
    this.techStackHeading = page.getByText('Our Tech Stack');
    this.wantToLearnMoreHeading = page.getByText('Want to learn more?');

    // CTAs
    this.getInTouchLink = page.getByRole('link', { name: /Get in touch/i }).first();
    this.goToProductLabLink = page.getByText(/Go to Product Lab/i);

    // Newsletter (footer)
    this.newsletterInput = page.getByPlaceholder(/enter your email/i);
    this.newsletterSignUpButton = page.getByRole('button', { name: /SIGN UP/i });
  }

  async open() {
    await this.navigate('/services/staff-augmentation');
    await this.waitForPageLoad();
  }
}

module.exports = StaffAugmentationPage;
