const { expect } = require('@playwright/test');
const { test } = require('../fixtures/fixtures');

// FOX2-47: Move the form to the end of the questionnaire
// Key changes verified here:
//   - Form removed from initial/landing screen
//   - CTA card added to initiate the assessment
//   - Question 8 button label changed to "Next"
//   - Form appears at the end (Q9 of 9) before showing results

test.describe('SC30 - AI Assessment Landing Page', () => {

  test('SC30-TC01 - Hero heading "All roads lead to AI-native." is visible', async ({ aiAssessmentPage }) => {
    await expect(aiAssessmentPage.heroHeading).toBeVisible();
    await expect(aiAssessmentPage.heroHeading).toContainText('All roads lead to AI-native.');
  });

  test('SC30-TC02 - CTA card heading "START WITH CLARITY" is visible', async ({ aiAssessmentPage }) => {
    await expect(aiAssessmentPage.ctaCardHeading).toBeVisible();
  });

  test('SC30-TC03 - CTA card describes "8 short questions" and "5 dimensions"', async ({ aiAssessmentPage }) => {
    await expect(aiAssessmentPage.ctaCardDescription).toBeVisible();
  });

  test('SC30-TC04 - "Take the self-assessment" CTA button is visible', async ({ aiAssessmentPage }) => {
    await expect(aiAssessmentPage.takeAssessmentButton).toBeVisible();
  });

  test('SC30-TC05 - No form inputs on landing page (form removed from initial screen)', async ({ aiAssessmentPage }) => {
    const inputCount = await aiAssessmentPage.page.locator('input').count();
    expect(inputCount).toBe(0);
  });

  test('SC30-TC06 - Stats show "8 Questions", "5 Dimensions", "Average"', async ({ aiAssessmentPage }) => {
    await expect(aiAssessmentPage.statQuestionsLabel).toBeVisible();
    await expect(aiAssessmentPage.statDimensionsLabel).toBeVisible();
    await expect(aiAssessmentPage.statAverageLabel).toBeVisible();
  });

  test('SC30-TC07 - "Under 3 minutes" timing info is visible', async ({ aiAssessmentPage }) => {
    await expect(aiAssessmentPage.timingInfo).toBeVisible();
  });

  test('SC30-TC08 - "You\'ll get" benefits section is visible', async ({ aiAssessmentPage }) => {
    await expect(aiAssessmentPage.youllGetLabel).toBeVisible();
  });
});

test.describe('SC31 - AI Assessment Questionnaire Flow', () => {

  test('SC31-TC01 - Clicking CTA starts questionnaire at Question 1 of 9', async ({ aiAssessmentPage }) => {
    // STEP 1: Click "Take the self-assessment"
    await aiAssessmentPage.startQuestionnaire();

    // STEP 2: Q1 progress shows "Question 1 of 9" in nav
    await expect(aiAssessmentPage.navQuestionProgress).toBeVisible();
    await expect(aiAssessmentPage.navQuestionProgress).toHaveText('Question 1 of 9');
  });

  test('SC31-TC02 - Q1 has answer options and a "Next" button but no "Back" button', async ({ aiAssessmentPage }) => {
    // STEP 1: Start questionnaire
    await aiAssessmentPage.startQuestionnaire();

    // STEP 2: Verify answer options exist
    await expect(aiAssessmentPage.answerOptions.first()).toBeVisible();
    const optionCount = await aiAssessmentPage.answerOptions.count();
    expect(optionCount).toBeGreaterThanOrEqual(4);

    // STEP 3: "Next" button is visible
    await expect(aiAssessmentPage.nextButton).toBeVisible();

    // STEP 4: No "Back" button on Q1 (first question has no previous step)
    await expect(aiAssessmentPage.backButton).not.toBeVisible();
  });

  test('SC31-TC03 - Answering Q1 and clicking Next advances to Question 2', async ({ aiAssessmentPage }) => {
    // STEP 1: Start questionnaire
    await aiAssessmentPage.startQuestionnaire();

    // STEP 2: Answer Q1 and click Next
    await aiAssessmentPage.answerAndAdvance();

    // STEP 3: Now on Q2
    await expect(aiAssessmentPage.navQuestionProgress).toHaveText('Question 2 of 9');
  });

  test('SC31-TC04 - Question 8 button label is "Next" (not "See my results")', async ({ aiAssessmentPage }) => {
    // STEP 1: Start questionnaire and answer Q1–Q7
    await aiAssessmentPage.startQuestionnaire();
    await aiAssessmentPage.advanceToQuestion(8);

    // STEP 2: Verify we are on Q8
    await expect(aiAssessmentPage.navQuestionProgress).toHaveText('Question 8 of 9');

    // STEP 3: "Next" button is present (ticket: Q8 label changed to "Next")
    await expect(aiAssessmentPage.nextButton).toBeVisible();

    // STEP 4: No "See my results" button on Q8 (that only appears on the form step)
    await expect(aiAssessmentPage.seeMyResultsButton).not.toBeVisible();
  });
});

test.describe('SC32 - AI Assessment Form Step', () => {

  test('SC32-TC01 - Form appears at Question 9 of 9 with "One last step" heading', async ({ aiAssessmentPage }) => {
    // STEP 1: Navigate through Q1–Q8
    await aiAssessmentPage.startQuestionnaire();
    await aiAssessmentPage.advanceToQuestion(9);

    // STEP 2: Progress shows Question 9 of 9
    await expect(aiAssessmentPage.navQuestionProgress).toHaveText('Question 9 of 9');

    // STEP 3: "One last step" heading visible (form moved to end per FOX2-47)
    await expect(aiAssessmentPage.formStepHeading).toBeVisible();
  });

  test('SC32-TC02 - Form has all required fields: First name, Last name, Work email, Company name', async ({ aiAssessmentPage }) => {
    // STEP 1: Navigate to form step
    await aiAssessmentPage.startQuestionnaire();
    await aiAssessmentPage.advanceToQuestion(9);

    // STEP 2: All form inputs are visible
    await expect(aiAssessmentPage.firstNameInput).toBeVisible();
    await expect(aiAssessmentPage.lastNameInput).toBeVisible();
    await expect(aiAssessmentPage.emailInput).toBeVisible();
    await expect(aiAssessmentPage.companyInput).toBeVisible();
  });

  test('SC32-TC03 - Form step shows "See my results" button and "← Back" button', async ({ aiAssessmentPage }) => {
    // STEP 1: Navigate to form step
    await aiAssessmentPage.startQuestionnaire();
    await aiAssessmentPage.advanceToQuestion(9);

    // STEP 2: "See my results" submit button is visible
    await expect(aiAssessmentPage.seeMyResultsButton).toBeVisible();

    // STEP 3: "← Back" button allows returning to Q8
    await expect(aiAssessmentPage.backButton).toBeVisible();
  });
});

test.describe('SC33 - AI Assessment Results', () => {

  test('SC33-TC01 - Completing the form shows "Your AI Readiness Results" in nav', async ({ aiAssessmentPage }) => {
    // STEP 1: Complete the full questionnaire
    await aiAssessmentPage.startQuestionnaire();
    await aiAssessmentPage.advanceToQuestion(9);

    // STEP 2: Fill and submit the form
    await aiAssessmentPage.fillAndSubmitForm({ firstName: 'Alex', lastName: 'Test', email: 'alex@test.com', company: 'Test Co' });

    // STEP 3: Results nav label is visible
    await expect(aiAssessmentPage.resultsNavLabel).toBeVisible();
  });

  test('SC33-TC02 - Results heading shows personalized first name', async ({ aiAssessmentPage }) => {
    // STEP 1: Complete full flow with a known first name
    await aiAssessmentPage.startQuestionnaire();
    await aiAssessmentPage.advanceToQuestion(9);
    await aiAssessmentPage.fillAndSubmitForm({ firstName: 'Morgan', lastName: 'Test', email: 'morgan@test.com', company: 'Test Co' });

    // STEP 2: Results h2 contains the submitted first name
    await expect(aiAssessmentPage.resultsHeading).toBeVisible();
    await expect(aiAssessmentPage.resultsHeading).toContainText('Morgan');
  });

  test('SC33-TC03 - Results page shows "Get your full diagnostic report" button', async ({ aiAssessmentPage }) => {
    // STEP 1: Complete full flow
    await aiAssessmentPage.startQuestionnaire();
    await aiAssessmentPage.advanceToQuestion(9);
    await aiAssessmentPage.fillAndSubmitForm();

    // STEP 2: Diagnostic report CTA is visible
    await expect(aiAssessmentPage.fullDiagnosticButton).toBeVisible();
  });

  test('SC33-TC04 - Results page shows "Book a strategy call" button', async ({ aiAssessmentPage }) => {
    // STEP 1: Complete full flow
    await aiAssessmentPage.startQuestionnaire();
    await aiAssessmentPage.advanceToQuestion(9);
    await aiAssessmentPage.fillAndSubmitForm();

    // STEP 2: Strategy call CTA is visible
    await expect(aiAssessmentPage.bookStrategyCallButton).toBeVisible();
  });
});
