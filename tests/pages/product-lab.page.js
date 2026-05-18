const BasePage = require('./base.page');

class ProductLabPage extends BasePage {
  constructor(page) {
    super(page);

    // Hero section
    this.heroHeading = page.getByText('AI CAN GENERATE CODE. PARTNERS BUILD PRODUCTS.');

    // Section headings
    this.defineProblemHeading = page.getByText('DEFINE THE PROBLEM');
    this.iterateRapidlyHeading = page.getByText('ITERATE RAPIDLY');
    this.buildForFutureHeading = page.getByText('BUILD FOR THE FUTURE');
    this.calibratedMvpHeading = page.getByText('A PROPERLY CALIBRATED MVP');
    this.humanExpertiseHeading = page.getByText('HUMAN EXPERTISE');
    this.aiNativeDevelopmentHeading = page.getByRole('heading', { name: /AI-NATIVE DEVELOPMENT/i });
    this.aimIndispensableHeading = page.getByRole('heading', { name: /AIM FOR.*INDISPENSABLE/i });
    this.readyToBuildHeading = page.getByText('Ready to get building?');

    // Case study link
    this.airspaceCaseStudyLink = page.getByText(/Airspace case study/i);

    // Go to case studies link
    this.goToCaseStudiesLink = page.getByRole('link', { name: /GO TO CASE STUDIES/i });

    // CTA
    this.letsTalkLink = page.getByRole('link', { name: /Let.?s talk/i }).first();

    // Newsletter (footer)
    this.newsletterInput = page.getByPlaceholder(/enter your email/i);
    this.newsletterSignUpButton = page.getByRole('button', { name: /SIGN UP/i });
  }

  async open() {
    await this.navigate('/services/product-lab');
    await this.waitForPageLoad();
  }
}

module.exports = ProductLabPage;
