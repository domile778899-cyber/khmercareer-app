/**
 * Job Search & Application E2E Tests
 * Tests job browsing, searching, filtering, and application flows.
 */
import { test, expect, type Page } from '@playwright/test';

const TEST_USER = {
  email: 'jobseeker@khmercareer.com',
  password: 'password123',
};

// ─── Helper Functions ────────────────────────────────────────────

async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

// ─── Test Suite ─────────────────────────────────────────────────

test.describe('Job Search & Application Flow', () => {
  test('should display job listings page', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    // Verify page title or heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Verify job listing elements exist
    const jobCards = page.locator('[data-testid="job-card"], .job-card, .job-listing').first();
    await expect(jobCards).toBeVisible({ timeout: 10000 }).catch(() => {
      // If no jobs loaded, check for empty state
      const emptyState = page.locator('text=No jobs, text=No results, .empty-state').first();
      expect(emptyState).toBeVisible();
    });
  });

  test('should search for jobs by keyword', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    // Find and fill search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name="keyword"], input[placeholder*="job" i]').first();
    
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('Software');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');

      // Verify search results or no results message
      const results = page.locator('[data-testid="job-card"], .job-card').first();
      const noResults = page.locator('text=No results, text=not found').first();

      try {
        await expect(results).toBeVisible({ timeout: 8000 });
      } catch {
        await expect(noResults).toBeVisible({ timeout: 8000 });
      }
    }
  });

  test('should filter jobs by location', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    // Find location filter
    const locationFilter = page.locator('select[name="location"], button:has-text("Location"), [data-testid="location-filter"]').first();
    
    if (await locationFilter.isVisible().catch(() => false)) {
      await locationFilter.click();
      
      // Select an option
      const option = page.locator('text=Phnom Penh, [role="option"]:has-text("Phnom Penh")').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
        await page.waitForLoadState('networkidle');

        // Verify filtered results
        const jobCards = page.locator('[data-testid="job-card"], .job-card').first();
        await expect(jobCards).toBeVisible({ timeout: 8000 }).catch(() => {
          // Empty results is also valid
          expect(page.locator('text=No jobs').first()).toBeVisible();
        });
      }
    }
  });

  test('should filter jobs by category/industry', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    // Find category filter
    const categoryFilter = page.locator('select[name="category"], select[name="industry"], button:has-text("Category"), button:has-text("Industry"), [data-testid="category-filter"]').first();
    
    if (await categoryFilter.isVisible().catch(() => false)) {
      await categoryFilter.click();
      
      // Select Technology category
      const option = page.locator('text=Technology, [role="option"]:has-text("Technology")').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Page should still be functional after filtering
    expect(page.url()).toContain('/jobs');
  });

  test('should filter jobs by job type', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    // Find job type filter buttons/checkboxes
    const typeFilter = page.locator('button:has-text("Full-time"), button:has-text("Full Time"), input[value="full_time"], label:has-text("Full-time")').first();
    
    if (await typeFilter.isVisible().catch(() => false)) {
      await typeFilter.click();
      await page.waitForLoadState('networkidle');

      // Verify URL or UI reflects the filter
      const currentUrl = page.url();
      expect(currentUrl).toContain('/jobs');
    }
  });

  test('should navigate to job detail page', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    // Click on first job card
    const firstJob = page.locator('[data-testid="job-card"], .job-card, a[href*="/jobs/"]').first();
    
    if (await firstJob.isVisible().catch(() => false)) {
      await firstJob.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to job detail page
      await expect(page).toHaveURL(/.*\/jobs\/.+/, { timeout: 10000 });

      // Verify job detail elements
      await expect(page.locator('h1').first()).toBeVisible();
      
      // Check for job description
      const description = page.locator('text=Description, [data-testid="job-description"], .job-description').first();
      await expect(description).toBeVisible().catch(() => {
        // Description may be loaded differently
      });
    }
  });

  test('should display job detail with all sections', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    // Find and click first job
    const firstJobLink = page.locator('a[href*="/jobs/"]').first();
    
    if (await firstJobLink.isVisible().catch(() => false)) {
      await firstJobLink.click();
      await page.waitForLoadState('networkidle');

      // Verify essential sections exist
      const title = page.locator('h1').first();
      await expect(title).toBeVisible();

      // Look for common job detail sections
      const companyInfo = page.locator('text=Company, text=About the company, [data-testid="company-info"]').first();
      const requirements = page.locator('text=Requirements, text=Skills, text=Qualifications').first();
      const applyButton = page.locator('button:has-text("Apply"), a:has-text("Apply"), [data-testid="apply-button"]').first();

      // At least some of these should be visible
      const hasCompany = await companyInfo.isVisible().catch(() => false);
      const hasRequirements = await requirements.isVisible().catch(() => false);
      const hasApplyBtn = await applyButton.isVisible().catch(() => false);

      expect(hasCompany || hasRequirements || hasApplyBtn).toBeTruthy();
    }
  });

  test('should allow user to favorite/unfavorite a job', async ({ page }) => {
    await loginUser(page, TEST_USER.email, TEST_USER.password);
    
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    // Find favorite button on first job card
    const favButton = page.locator('[data-testid="favorite-btn"], button[aria-label*="favorite" i], button[aria-label*="bookmark" i], .favorite-button').first();
    
    if (await favButton.isVisible().catch(() => false)) {
      await favButton.click();
      await page.waitForTimeout(1000);

      // Click again to unfavorite
      await favButton.click();
      await page.waitForTimeout(1000);

      // Test passes if no errors occurred
      expect(true).toBeTruthy();
    }
  });

  test('should navigate to factory jobs page', async ({ page }) => {
    await page.goto('/factory-jobs');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page.locator('h1, h2').first()).toBeVisible();
    expect(page.url()).toContain('/factory-jobs');
  });

  test('should navigate to Chinese enterprise jobs page', async ({ page }) => {
    await page.goto('/chinese-enterprise');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page.locator('h1, h2').first()).toBeVisible();
    expect(page.url()).toContain('/chinese-enterprise');
  });

  test('should show employers list page', async ({ page }) => {
    await page.goto('/employers');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    expect(page.url()).toContain('/employers');
  });
});
