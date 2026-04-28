const BasePage = require('./base.page');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // Header / Nav
    this.logo = page.locator('a').filter({ hasText: 'Foxbox Digital' }).first();
    this.logoImage = page.locator('header img, nav img').first();
    this.hamburgerMenu = page.getByRole('button', { name: 'Menu' });

    // Nav menu (opened after clicking hamburger)
    this.navMenu = page.locator('nav, [class*="menu"], [class*="Menu"]').filter({ hasText: 'COMPANY' });
    this.navMenuCloseButton = page.getByRole('button', { name: /close|×|✕/i }).or(page.locator('button').filter({ hasText: /^[×✕x]$/i })).last();
    this.navLetsChatButton = page.getByRole('link', { name: /LET'S CHAT/i });

    // COMPANY links
    this.navAboutUs = page.getByRole('link', { name: 'About Us' });
    this.navOurWork = page.getByRole('link', { name: 'Our Work' });
    this.navInsideTheBox = page.getByRole('link', { name: 'Inside the Box' });
    this.navCareers = page.getByRole('link', { name: 'Careers' });

    // SOLUTIONS links
    this.navProductLab = page.getByRole('link', { name: 'Product Lab' }).first();
    this.navProductMaintenance = page.getByRole('link', { name: 'Product Maintenance' }).first();
    this.navStaffAug = page.getByRole('link', { name: 'Staff Aug+' }).first();
    this.navHealthcare = page.getByRole('link', { name: 'Healthcare' });
    // WORK links
    this.navSeeAllCaseStudies = page.getByRole('link', { name: 'See All Case Studies' });
    this.navAirspace = page.getByRole('link', { name: /Airspace Data/i });
    this.navVersapay = page.getByRole('link', { name: /Versapay/i });
    this.navAnthem = page.getByRole('link', { name: /Anthem.*Telehealth/i });

    // Hero section
    this.heroHeading = page.getByText('AI can generate code.');
    this.heroSubheading = page.getByText('Partners build products.');

    // Welcome section
    this.welcomeHeading = page.getByText('Welcome to Foxbox.');
    this.welcomeBody = page.getByText(
      /Foxbox Digital is a Chicago-based digital product agency/
    );

    // Case study: K Health
    this.kHealthHeading = page.getByText('Products that improve lives.');
    this.kHealthDescription = page.getByText(
      'How we helped evolve K Health'
    );
    this.kHealthCaseStudyLink = page
      .getByRole('link', { name: /SEE THE CASE STUDY/i })
      .first();

    // Case study: X Company
    this.xCompanyHeading = page.getByText('Platforms users can depend on.');
    this.xCompanyDescription = page.getByText(
      "How we built a custom platform to power The X Company"
    );
    this.xCompanyCaseStudyLink = page
      .getByRole('link', { name: /SEE THE CASE STUDY/i })
      .nth(1);

    // Case study: Home Chef
    this.homeChefHeading = page.getByText('Technology that delivers growth.');
    this.homeChefDescription = page.getByText(
      'How we helped Home Chef delight customers'
    );
    this.homeChefCaseStudyLink = page
      .getByRole('link', { name: /SEE THE CASE STUDY/i })
      .nth(2);

    // Testimonial section
    this.testimonialQuote = page.getByText(
      'We built a solution customers have reviewed as'
    );
    this.testimonialAuthor = page.getByText('Plamen Petrov');
    this.testimonialReadMore = page.getByRole('link', { name: /READ MORE/i }).first();

    // Services section ("Build what you couldn't have 6 months ago")
    this.servicesHeading = page.getByText(/Build what you couldn.t have 6 months ago/);
    this.servicesBody = page.getByText(
      'AI is accelerating our process and sharpening our focus'
    );
    this.productLabAccordion = page.getByText('Product Lab').first();
    this.productMaintenanceAccordion = page.getByText('Product Maintenance').first();
    this.staffAugAccordion = page.getByText('Staff Aug+').first();

    // Services expanded content (visible only when accordion is open)
    this.productLabDescription = page.getByText('World-class digital products, built one properly calibrated experiment at a time.');
    this.productMaintenanceDescription = page.getByText(/Keep your customers happy and your team.s energy/);
    this.staffAugDescription = page.getByText(/Pay off technical debt and boost your team.s productivity/);

    // Services accordion content containers — used for CSS height assertions (collapsed = height:0px)
    // The accordion hides content via height:0/overflow:hidden, so toBeVisible() won't detect collapse.
    this.productLabContent = page.locator('.accordion-item-content').filter({ hasText: /World-class digital products/ });
    this.productMaintenanceContent = page.locator('.accordion-item-content').filter({ hasText: /Keep your customers happy/ });
    this.staffAugContent = page.locator('.accordion-item-content').filter({ hasText: /Pay off technical debt/ });

    // Services LEARN MORE links — scoped to each accordion's content container
    // (the <a> has no href so getByRole('link') doesn't match it)
    this.productLabLearnMore = this.productLabContent.locator('a');
    this.productMaintenanceLearnMore = this.productMaintenanceContent.locator('a');
    this.staffAugLearnMore = this.staffAugContent.locator('a');

    // Inside the Box (blog)
    this.insideTheBoxHeading = page.getByText('Inside the Box');
    this.blogArticles = page.getByRole('link', { name: /READ MORE/i });
    this.firstArticleTitle = page.getByText('The Three Agent Model: How We Approach AI-Native Development');
    this.secondArticleTitle = page.getByText('14 Days, 76 Commits, One Production Website');
    this.thirdArticleTitle = page.getByText(/Why Your Cursor-Built MVP Will Break/);

    // What We Believe section
    this.whatWeBelieveHeading = page.getByText('What We Believe');
    this.belief1 = page.getByText('Relentlessly pursue the truth.');
    this.belief2 = page.getByText('Take calculated risks.');
    this.belief3 = page.getByText('Be persistent.');
    this.belief4 = page.getByText(/Adapt to our clients.? environment/);
    this.belief5 = page.getByText('Be a puzzle solver, not a code factory.');
    this.belief6 = page.getByText('Deep focus, always');
    this.whyWeDoButton = page.getByText(/WHY WE DO WHAT WE DO/i);

    // Trusted to deliver section
    this.trustedHeading = page.getByText('Trusted to deliver');
    this.kHealthLogo = page.getByAltText(/k health/i).first();
    this.versapayLogo = page.getByAltText(/versapay/i);
    this.anthemLogo = page.getByAltText(/anthem/i);
    this.freshpaintLogo = page.getByAltText(/freshpaint/i);
    this.homeChefLogo = page.getByAltText(/home chef/i);

    // CTA section
    this.ctaHeading = page.getByText('Ready to get building?');
    this.chatWithUsButton = page.getByText(/CHAT WITH US/i).first();

    // Footer
    this.footerContactUs = page.locator('footer').getByText('Contact us').first();
    this.footerFollowUs = page.locator('footer').getByText('Follow Us');
    this.footerLinkedIn = page.locator('footer').getByRole('link', { name: /linkedin/i });
    this.footerAbout = page.locator('footer').getByRole('link', { name: 'About' });
    this.footerBlog = page.locator('footer').getByRole('link', { name: 'Blog' });
    this.footerCareers = page.locator('footer').getByRole('link', { name: 'Careers' });
    this.footerApproach = page.locator('footer').getByRole('link', { name: 'Approach' });
    this.footerCulture = page.locator('footer').getByRole('link', { name: 'Culture' });
    this.footerProductLab = page.locator('footer').getByRole('link', { name: 'Product Lab' });
    this.footerProductMaintenance = page.locator('footer').getByRole('link', { name: 'Product Maintenance' });
    this.footerStaffAug = page.locator('footer').getByRole('link', { name: 'Staff Aug+' });
    this.newsletterInput = page.getByPlaceholder(/enter your email/i);
    this.newsletterSignUpButton = page.getByRole('button', { name: /SIGN UP/i });
    this.footerCopyright = page.getByText('© 2026 Foxbox, LLC');
    this.footerPrivacyPolicy = page.locator('footer').getByRole('link', { name: /Privacy Policy/i });
  }

  async open() {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async clickHamburgerMenu() {
    await this.hamburgerMenu.click();
  }

  async openNavMenu() {
    await this.hamburgerMenu.click();
    await this.page.waitForTimeout(500); // allow slide-in animation
  }

  async closeNavMenu() {
    await this.navMenuCloseButton.click();
    await this.page.waitForTimeout(300);
  }

  async clickKHealthCaseStudy() {
    await this.scrollToElement(this.kHealthCaseStudyLink);
    await this.kHealthCaseStudyLink.click();
  }

  async clickXCompanyCaseStudy() {
    await this.scrollToElement(this.xCompanyCaseStudyLink);
    await this.xCompanyCaseStudyLink.click();
  }

  async clickHomeChefCaseStudy() {
    await this.scrollToElement(this.homeChefCaseStudyLink);
    await this.homeChefCaseStudyLink.click();
  }

  async expandProductLab() {
    await this.scrollToElement(this.productLabAccordion);
    await this.productLabAccordion.click();
  }

  async collapseProductLab() {
    await this.scrollToElement(this.productLabAccordion);
    await this.productLabAccordion.click();
    await this.page.waitForTimeout(300);
  }

  async expandProductMaintenance() {
    await this.scrollToElement(this.productMaintenanceAccordion);
    await this.productMaintenanceAccordion.click();
  }

  async collapseProductMaintenance() {
    await this.scrollToElement(this.productMaintenanceAccordion);
    await this.productMaintenanceAccordion.click();
    await this.page.waitForTimeout(300);
  }

  async expandStaffAug() {
    await this.scrollToElement(this.staffAugAccordion);
    await this.staffAugAccordion.click();
  }

  async collapseStaffAug() {
    await this.scrollToElement(this.staffAugAccordion);
    await this.staffAugAccordion.click();
    await this.page.waitForTimeout(300);
  }

  async clickProductLabLearnMore() {
    await this.productLabLearnMore.click();
  }

  async clickProductMaintenanceLearnMore() {
    await this.productMaintenanceLearnMore.click();
  }

  async clickStaffAugLearnMore() {
    await this.staffAugLearnMore.click();
  }

  async clickLogo() {
    await this.logo.click();
    await this.waitForPageLoad();
  }

  async clickWhyWeDoButton() {
    await this.scrollToElement(this.whyWeDoButton);
    await this.whyWeDoButton.click();
    await this.waitForPageLoad();
  }

  async clickTestimonialReadMore() {
    await this.scrollToElement(this.testimonialReadMore);
    await this.testimonialReadMore.click();
    await this.waitForPageLoad();
  }

  async clickChatWithUs() {
    await this.scrollToElement(this.chatWithUsButton);
    await this.chatWithUsButton.click();
  }

  async fillNewsletterEmail(email) {
    await this.scrollToElement(this.newsletterInput);
    await this.newsletterInput.fill(email);
  }

  async submitNewsletter() {
    await this.newsletterSignUpButton.click();
  }
}

module.exports = HomePage;
