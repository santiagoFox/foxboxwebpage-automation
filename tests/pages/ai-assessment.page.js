const BasePage = require('./base.page');

class AiAssessmentPage extends BasePage {
  constructor(page) {
    super(page);

    // === LANDING PAGE ===
    this.heroHeading = page.locator('h1');
    this.ctaCardHeading = page.locator('h2');
    this.ctaCardDescription = page.getByText(/8 short questions/i);
    this.statQuestionsLabel = page.getByText('Questions', { exact: true });
    this.statDimensionsLabel = page.getByText('Dimensions', { exact: true });
    this.statAverageLabel = page.getByText('Average', { exact: true });
    this.takeAssessmentButton = page.getByRole('button', { name: /take the self-assessment/i });
    this.youllGetLabel = page.getByText(/you.ll get/i);
    this.timingInfo = page.getByText(/under 3 minutes/i);
    this.cookieAcceptAll = page.getByRole('button', { name: /accept all/i });

    // === QUESTIONNAIRE ===
    this.navQuestionProgress = page.locator('nav').getByText(/Question \d+ of 9/);
    this.answerOptions = page.locator('div.cursor-pointer');
    this.nextButton = page.locator('button').filter({ hasText: 'Next' });
    this.backButton = page.locator('button').filter({ hasText: /back/i });

    // === FORM STEP (Q9) ===
    this.formStepHeading = page.getByText(/one last step/i);
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.companyInput = page.locator('input[name="company"]');
    this.seeMyResultsButton = page.locator('button').filter({ hasText: /see my results/i });

    // === RESULTS ===
    this.resultsNavLabel = page.locator('nav').getByText('Your AI Readiness Results');
    this.resultsHeading = page.locator('h2').filter({ hasText: /here.s your score/i });
    this.fullDiagnosticButton = page.locator('button').filter({ hasText: /get your full diagnostic report/i });
    this.bookStrategyCallButton = page.locator('button').filter({ hasText: /book a strategy call/i });
  }

  async open() {
    await this.navigate('/ai-native-assessment');
    await this.waitForPageLoad();
  }

  async dismissCookieBanner() {
    await this.cookieAcceptAll.click().catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async startQuestionnaire() {
    await this.takeAssessmentButton.click();
    await this.page.waitForTimeout(800);
  }

  // REUSE_METHOD: answerCurrentQuestion
  async answerCurrentQuestion() {
    await this.answerOptions.first().click();
    await this.page.waitForTimeout(300);
  }

  // REUSE_METHOD: answerAndAdvance
  async answerAndAdvance() {
    await this.answerCurrentQuestion();
    await this.nextButton.click();
    await this.page.waitForTimeout(800);
  }

  // Navigate from Q1 to question N by answering all preceding questions.
  async advanceToQuestion(targetQ) {
    for (let i = 1; i < targetQ; i++) {
      await this.answerAndAdvance();
    }
  }

  async fillAndSubmitForm({ firstName = 'Jane', lastName = 'Smith', email = 'jane@test.com', company = 'Test Corp' } = {}) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.companyInput.fill(company);
    await this.seeMyResultsButton.click();
    await this.page.waitForTimeout(1500);
  }
}

module.exports = AiAssessmentPage;
