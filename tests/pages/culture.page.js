const BasePage = require('./base.page');

class CulturePage extends BasePage {
  constructor(page) {
    super(page);

    // Hero section
    this.heroHeading = page.getByText('Move Purposely.');

    // Section headings
    this.movePurposelyHeading = page.getByText('Move Purposely.');
    this.foxboxWayHeading = page.getByText('The Foxbox Way');
    this.whatWeBelieveHeading = page.getByText('What We Believe');

    // Core beliefs
    this.belief1 = page.getByText('Relentlessly pursue the truth.');
    this.belief2 = page.getByText('Take calculated risks.');
    this.belief3 = page.getByText('Be persistent.');
    this.belief4 = page.getByText(/Adapt to our clients.? environment/);
    this.belief5 = page.getByText('Be a puzzle solver, not a code factory.');
    this.belief6 = page.getByText('Deep focus, always');

    // CTAs
    this.readMoreLink = page.getByRole('link', { name: /READ MORE/i }).first();
    this.contactUsLink = page.getByRole('link', { name: /Contact us/i }).first();

    // Newsletter (footer)
    this.newsletterInput = page.getByPlaceholder(/enter your email/i);
    this.newsletterSignUpButton = page.getByRole('button', { name: /SIGN UP/i });
  }

  async open() {
    await this.navigate('/about/culture');
    await this.waitForPageLoad();
  }
}

module.exports = CulturePage;
