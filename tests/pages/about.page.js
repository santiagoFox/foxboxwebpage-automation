const BasePage = require('./base.page');

class AboutPage extends BasePage {
  constructor(page) {
    super(page);

    // Hero section
    this.heroHeading = page.getByText(
      'Foxbox creates digital products that become indispensable for your business and your customers.'
    );
    this.heroSubheading = page.getByText('Staples for them. Growth engines for you.');

    // Section headings
    this.whoWeAreHeading = page.getByText('WHO WE ARE');
    this.leadershipHeading = page.getByText('Our Leadership Team');
    this.whyFoxboxHeading = page.getByText('WHY FOXBOX?');
    this.ourCultureLink = page.getByRole('link', { name: /OUR CULTURE/i });
    this.whatWeBelieveHeading = page.getByText('What We Believe');
    this.letsGetThingsDoneHeading = page.getByText("Let's Get Things Done, Together");

    // Leadership team cards
    this.robVolkCard = page.getByText('Rob Volk');
    this.elliottTorresCard = page.getByText('Elliott Torres');
    this.barrettWillichCard = page.getByText('Barrett Willich');

    // CTA — same pattern as home page; element is not an <a role="link">
    this.chatWithUsButton = page.getByText(/CHAT WITH US/i).first();

    // Newsletter (footer)
    this.newsletterInput = page.getByPlaceholder(/enter your email/i);
    this.newsletterSignUpButton = page.getByRole('button', { name: /SIGN UP/i });
  }

  async open() {
    await this.navigate('/about');
    await this.waitForPageLoad();
  }
}

module.exports = AboutPage;
