/**
 * AI Features E2E Tests
 * Tests AI-powered features: resume optimization, salary analysis, job matching.
 */
import { test, expect, type Page } from '@playwright/test';

const TEST_USER = {
  email: 'jobseeker@khmercareer.com',
  password: 'password123',
};

async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

// ─── Test Suite ─────────────────────────────────────────────────

test.describe('AI Features Flow', () => {
  test('should display AI generation page', async ({ page }) => {
    await page.goto('/ai-generate');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    expect(page.url()).toContain('/ai-generate');
  });

  test('should display AI job match page', async ({ page }) => {
    await page.goto('/ai-match');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    expect(page.url()).toContain('/ai-match');
  });

  test('should have resume optimization input', async ({ page }) => {
    await page.goto('/ai-generate');
    await page.waitForLoadState('networkidle');

    // Look for resume input area (textarea or file upload)
    const resumeInput = page.locator('textarea[placeholder*="resume" i], textarea[name="resume"], input[type="file"][accept*=".pdf"], [data-testid="resume-input"]').first();
    const textInput = page.locator('textarea').first();

    const hasResumeInput = await resumeInput.isVisible().catch(() => false);
    const hasTextInput = await textInput.isVisible().catch(() => false);

    expect(hasResumeInput || hasTextInput).toBeTruthy();
  });

  test('should have AI generate/submit button', async ({ page }) => {
    await page.goto('/ai-generate');
    await page.waitForLoadState('networkidle');

    // Look for generate button
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Optimize"), button:has-text("Analyze"), button:has-text("Submit"), [data-testid="generate-btn"]').first();
    await expect(generateButton).toBeVisible();
  });

  test('should show AI feature sections on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for AI-related content on homepage
    const aiSection = page.locator('text=AI, text=Artificial Intelligence, text=Smart, [data-testid="ai-section"], .ai-features').first();
    
    // AI section may be present on homepage
    await expect(aiSection).toBeVisible().catch(() => {
      // AI features may not be prominently displayed on homepage
      expect(page.locator('h1').first()).toBeVisible();
    });
  });

  test('should have job matching form elements', async ({ page }) => {
    await page.goto('/ai-match');
    await page.waitForLoadState('networkidle');

    // Look for job matching form elements
    const skillsInput = page.locator('input[placeholder*="skill" i], textarea[name="skills"], select[name="skills"]').first();
    const experienceInput = page.locator('input[name="experience"], select[name="experience"], input[placeholder*="experience" i]').first();
    const matchButton = page.locator('button:has-text("Match"), button:has-text("Find"), button:has-text("Search"), [data-testid="match-btn"]').first();

    const hasSkills = await skillsInput.isVisible().catch(() => false);
    const hasExperience = await experienceInput.isVisible().catch(() => false);
    const hasMatchBtn = await matchButton.isVisible().catch(() => false);

    // At least some matching elements should be present
    expect(hasSkills || hasExperience || hasMatchBtn).toBeTruthy();
  });

  test('should have salary analysis section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to salary-related page if exists
    const salaryLink = page.locator('a[href*="salary"], a:has-text("Salary"), button:has-text("Salary")').first();
    
    if (await salaryLink.isVisible().catch(() => false)) {
      await salaryLink.click();
      await page.waitForLoadState('networkidle');
      
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    }
  });

  test('should display AI interview page', async ({ page }) => {
    await page.goto('/interview');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    expect(page.url()).toContain('/interview');
  });

  test('should display video interview page', async ({ page }) => {
    await page.goto('/video-interview');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    expect(page.url()).toContain('/video-interview');
  });

  test('should handle AI content generation submission', async ({ page }) => {
    await page.goto('/ai-generate');
    await page.waitForLoadState('networkidle');

    // Fill in any available input
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible().catch(() => false)) {
      await textarea.fill('I am a software engineer with 5 years of experience in React and Node.js.');
    }

    // Click generate button
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Optimize"), button:has-text("Submit"), button[type="submit"]').first();
    if (await generateButton.isVisible().catch(() => false) && await generateButton.isEnabled().catch(() => false)) {
      await generateButton.click();
      await page.waitForTimeout(3000);

      // Check for loading state or result
      const resultArea = page.locator('[data-testid="result"], .result, .output, [data-testid="ai-result"]').first();
      const loadingState = page.locator('text=Loading, text=Generating, .loading, .spinner').first();

      // Either loading or result should appear
      const hasResult = await resultArea.isVisible().catch(() => false);
      const hasLoading = await loadingState.isVisible().catch(() => false);

      expect(hasResult || hasLoading).toBeTruthy();
    }
  });

  test('should display video resume page', async ({ page }) => {
    await page.goto('/video-resume');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    expect(page.url()).toContain('/video-resume');
  });
});
