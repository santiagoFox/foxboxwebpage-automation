const BasePage = require('./base.page');

class ApproachPage extends BasePage {
  constructor(page) {
    super(page);

    // Hero section
    this.heroHeading = page.getByText('How We Get Things Done');

    // Section headings
    this.sevenThingsHeading = page.getByText('The 7 Things That Enable Us to Build Great Products');
    this.hireBestPeopleHeading = page.getByText('Hire the best people (that fit our culture)');
    this.crossFunctionalTeamsHeading = page.getByText('Flexible cross-functional product teams');
    this.modernDigitalStrategiesHeading = page.getByText('Modern digital strategies');
    this.humanCenteredHeading = page.getByText(/Human-centered Design, Agile/i);
    this.delightCustomersHeading = page.getByText(/Delight customers and measure success/i);
    this.executiveVisibilityHeading = page.getByText('Executive visibility done right');
    this.longTermPartnershipsHeading = page.getByText('Long-term partnerships & support');
    this.letsGetThingsDoneHeading = page.getByText("Let's Get Things Done, Together");

    // Testimonials
    this.plamenPetrovQuote = page.getByText(/Foxbox operated as a startup/i);
    this.susanLowitzQuote = page.getByText(/staff-side software made an exponential difference/i);

    // CTA
    this.chatWithUsButton = page.getByText(/CHAT WITH US/i).first();

    // Newsletter (footer)
    this.newsletterInput = page.getByPlaceholder(/enter your email/i);
    this.newsletterSignUpButton = page.getByRole('button', { name: /SIGN UP/i });
  }

  async open() {
    await this.navigate('/approach');
    await this.waitForPageLoad();
  }
}

module.exports = ApproachPage;
