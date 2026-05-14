const BasePage = require('./base.page');

class ContactPage extends BasePage {
  constructor(page) {
    super(page);

    // Cookie consent banner
    this.cookieAcceptAllBtn    = page.getByRole('button', { name: 'Accept all' });
    this.cookieEssentialOnlyBtn = page.getByRole('button', { name: 'Essential only' });

    // Page content
    this.pageHeading = page.getByRole('heading', { name: "Let's Chat" });
    this.pageSubheading = page.getByText(/Tell us what you.re looking for/i);

    // Office location cards
    this.chicagoOffice  = page.getByRole('heading', { name: 'Chicago (HQ)' });
    this.denverOffice   = page.getByRole('heading', { name: 'Denver' });
    this.brazilOffice   = page.getByRole('heading', { name: 'Brazil' });
    this.argentinaOffice = page.getByRole('heading', { name: 'Argentina' });

    // HubSpot form (rendered inside an iframe regardless of cookie choice)
    this.formFrame = page.frameLocator('#hs-form-iframe-0');
    this.formEmail     = this.formFrame.locator('input[name="email"]');
    this.formFirstName = this.formFrame.locator('input[name="firstname"]');
    this.formLastName  = this.formFrame.locator('input[name="lastname"]');
    this.formJobTitle  = this.formFrame.locator('input[name="jobtitle"]');
    this.formPhone     = this.formFrame.locator('input[name="phone"]');
    this.formMessage   = this.formFrame.locator('input[name="can_you_tell_us_a_little_more_about_that_"]');
    this.formSubmitBtn = this.formFrame.locator('input[type="submit"]');

    // "What can Foxbox do for you?" checkboxes
    this.checkboxNewProduct = this.formFrame.locator('input[name="what_can_foxbox_do_for_you_"]').nth(0);
    this.checkboxImprove    = this.formFrame.locator('input[name="what_can_foxbox_do_for_you_"]').nth(1);
    this.checkboxOther      = this.formFrame.locator('input[name="what_can_foxbox_do_for_you_"]').nth(2);
  }

  async open() {
    await this.navigate('/contact');
    await this.waitForPageLoad();
  }

  async acceptAllCookies() {
    await this.cookieAcceptAllBtn.waitFor({ state: 'visible' });
    await this.cookieAcceptAllBtn.click();
    await this.formEmail.waitFor({ state: 'visible', timeout: 10000 });
  }

  async acceptEssentialCookies() {
    await this.cookieEssentialOnlyBtn.waitFor({ state: 'visible' });
    await this.cookieEssentialOnlyBtn.click();
    await this.formEmail.waitFor({ state: 'visible', timeout: 10000 });
  }
}

module.exports = ContactPage;
