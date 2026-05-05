const BasePage = require('./base.page');

class BlogPage extends BasePage {
  constructor(page) {
    super(page);

    // Hero section
    this.heroHeading = page.getByRole('heading', { name: 'Inside the Box' });
    this.heroSubheading = page.getByText('Articles, updates, and ideas you can put to use.');

    // Article cards — the blog index links articles via their title, not a "Read More" button.
    // Exclude pagination links (/blog/page/N) so only article slugs are counted.
    this.articleLinks = page.locator('a[href^="/blog/"]:not([href^="/blog/page/"])');
    this.firstArticleTitle = page.getByText('AI Native Readiness: Beyond Bolted-on AI Solutions');
    this.secondArticleTitle = page.getByText('K Health: Powering AI-Driven Healthcare');
    this.thirdArticleTitle = page.getByText('Automated QA Testing in Claude Code');

    // Pagination
    this.paginationNext = page.getByRole('link', { name: /Next/i });

    // Newsletter (footer)
    this.newsletterInput = page.getByPlaceholder(/enter your email/i);
    this.newsletterSignUpButton = page.getByRole('button', { name: /SIGN UP/i });
  }

  async open() {
    await this.navigate('/blog');
    await this.waitForPageLoad();
  }
}

module.exports = BlogPage;
