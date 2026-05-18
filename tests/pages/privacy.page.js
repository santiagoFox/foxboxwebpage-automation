const BasePage = require('./base.page');

class PrivacyPage extends BasePage {
  constructor(page) {
    super(page);

    // Page heading
    this.pageHeading = page.getByRole('heading', { name: /Web Site Terms and Conditions of Use/i });

    // Terms and Conditions section headings
    this.termsHeading = page.getByRole('heading', { name: /1\.\s*Terms/i });
    this.useLicenseHeading = page.getByRole('heading', { name: /Use License/i });
    this.disclaimerHeading = page.getByRole('heading', { name: /Disclaimer/i });
    this.linksHeading = page.getByRole('heading', { name: /^Links$/i });
    this.governingLawHeading = page.getByRole('heading', { name: /Governing Law/i });

    // Privacy Policy section heading
    this.privacyPolicyHeading = page.getByRole('heading', { name: /Privacy Policy/i });

    // Privacy policy introductory text
    this.privacyIntroText = page.getByText(/Your privacy is critical to us/i);
  }

  async open() {
    await this.navigate('/privacy');
    await this.waitForPageLoad();
  }
}

module.exports = PrivacyPage;
