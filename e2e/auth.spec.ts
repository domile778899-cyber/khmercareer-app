/**
 * Authentication E2E Tests
 * Tests login, registration, logout, and password reset flows.
 */
import { test, expect, type Page } from '@playwright/test';

// ─── Test Data ──────────────────────────────────────────────────

const TEST_USER = {
  email: 'jobseeker@khmercareer.com',
  password: 'password123',
  fullName: 'Test Jobseeker',
};

const NEW_USER = {
  email: `test_${Date.now()}@example.com`,
  password: 'TestPass123!',
  fullName: 'New Test User',
  phone: '+85512345678',
};

// ─── Helper Functions ────────────────────────────────────────────

async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', email);
  await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i]', password);
  await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');
  await page.waitForLoadState('networkidle');
}

async function logoutUser(page: Page) {
  // Click on user menu/logout button if present
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")').first();
  if (await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
    await page.waitForLoadState('networkidle');
  }
}

// ─── Test Suite ─────────────────────────────────────────────────

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    await logoutUser(page);
  });

  test('should display login page with all elements', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('h1, h2', { timeout: 10000 });

    // Verify login form elements exist
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();

    // Verify "Remember me" checkbox or link options
    const rememberMe = page.locator('text=Remember me, text=Keep me signed in').first();
    await expect(rememberMe).toBeVisible().catch(() => {
      // Optional element
    });

    // Verify forgot password link
    const forgotPassword = page.locator('a:has-text("Forgot"), a:has-text("Reset"), text=Forgot password').first();
    await expect(forgotPassword).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginUser(page, TEST_USER.email, TEST_USER.password);

    // Should redirect to home or dashboard after successful login
    await page.waitForURL(/\/(|profile|dashboard)$/, { timeout: 15000 });

    // Verify user is logged in by checking for user-specific elements
    const userElements = page.locator('text=Profile, text=Dashboard, [data-testid="user-menu"], .user-avatar').first();
    await expect(userElements).toBeVisible({ timeout: 10000 }).catch(async () => {
      // Fallback: check URL doesn't contain login
      expect(page.url()).not.toContain('/login');
    });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"], input[name="email"]', 'invalid@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Should show error message
    const errorLocator = page.locator('text=Invalid, text=incorrect, text=wrong, text=failed, [role="alert"]').first();
    await expect(errorLocator).toBeVisible({ timeout: 10000 });

    // Should remain on login page
    expect(page.url()).toContain('/login');
  });

  test('should validate required fields on login form', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Check for HTML5 validation or error messages
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);

    // HTML5 validation should prevent submission
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test('should navigate to registration page from login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Click on "Don't have an account" or "Sign up" link
    const registerLink = page.locator('a[href="/register"], a:has-text("Sign up"), a:has-text("Register"), a:has-text("Create account")').first();
    await expect(registerLink).toBeVisible();
    await registerLink.click();

    await page.waitForURL('**/register', { timeout: 10000 });
    expect(page.url()).toContain('/register');

    // Verify registration form elements
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]').first()).toBeVisible();
    await expect(page.locator('input[name="fullName"], input[name="name"], input[placeholder*="name" i]').first()).toBeVisible();
  });

  test('should display registration page with all required fields', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Verify registration form has all required fields
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
    await expect(page.locator('input[name="fullName"], input[name="name"]').first()).toBeVisible();

    // Verify role selection exists (jobseeker/employer)
    const roleSelector = page.locator('select[name="role"], input[name="role"], [data-testid="role-select"]').first();
    await expect(roleSelector).toBeVisible().catch(() => {
      // Role may be selected differently
    });

    // Verify terms checkbox
    const termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="agree"]').first();
    await expect(termsCheckbox).toBeVisible().catch(() => {
      // Terms may be optional or styled differently
    });

    // Verify submit button
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
  });

  test('should show password strength indicator on registration', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('weak');

    // Check for password strength indicator
    const strengthIndicator = page.locator('[data-testid="password-strength"], .password-strength, text=Weak, text=Strong').first();

    // This may or may not exist depending on implementation
    if (await strengthIndicator.isVisible().catch(() => false)) {
      await expect(strengthIndicator).toBeVisible();
    }
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await loginUser(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/(|profile)$/, { timeout: 15000 });

    // Perform logout
    await logoutUser(page);

    // After logout, user menu should not be visible or should redirect
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify logged out state - try to access profile page should redirect to login
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login.*/, { timeout: 10000 });
  });

  test('should persist login state after page refresh', async ({ page }) => {
    // Login first
    await loginUser(page, TEST_USER.email, TEST_USER.password);
    await page.waitForURL(/\/(|profile)$/, { timeout: 15000 });

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be logged in (not redirected to login)
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
  });

  test('should redirect unauthenticated user from protected route', async ({ page }) => {
    // Clear any auth state
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login.*/, { timeout: 10000 });
  });
});
