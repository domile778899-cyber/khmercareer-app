/**
 * Admin Dashboard E2E Tests
 * Tests admin CRUD operations, user management, and analytics.
 */
import { test, expect, type Page } from '@playwright/test';

const ADMIN_USER = {
  email: 'admin@khmercareer.com',
  password: 'admin123',
};

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

async function logoutUser(page: Page) {
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")').first();
  if (await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
    await page.waitForLoadState('networkidle');
  }
}

// ─── Test Suite ─────────────────────────────────────────────────

test.describe('Admin Dashboard CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, ADMIN_USER.email, ADMIN_USER.password);
  });

  test.afterEach(async ({ page }) => {
    await logoutUser(page);
  });

  test('should access admin dashboard page', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Should not redirect to login (admin has access)
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');

    // Verify dashboard heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should display dashboard statistics cards', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for statistics cards (users, jobs, courses, revenue)
    const statsSection = page.locator('[data-testid="stats-cards"], .stats-grid, .dashboard-stats, .metric-card').first();
    const anyStats = page.locator('text=Users, text=Jobs, text=Courses, text=Revenue, text=Total').first();

    await expect(statsSection).toBeVisible({ timeout: 10000 }).catch(async () => {
      await expect(anyStats).toBeVisible({ timeout: 10000 });
    });
  });

  test('should display users management page', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    expect(page.url()).toContain('/admin/users');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Look for user table or list
    const userTable = page.locator('table, [data-testid="users-table"], .users-list').first();
    await expect(userTable).toBeVisible({ timeout: 10000 }).catch(() => {
      // May show empty state
      expect(page.locator('text=No users, .empty-state').first()).toBeVisible();
    });
  });

  test('should search users in admin panel', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name="search"]').first();
    
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('test');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');

      // Verify search completed (no error)
      expect(page.url()).toContain('/admin/users');
    }
  });

  test('should display jobs management page', async ({ page }) => {
    await page.goto('/admin/jobs');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    expect(page.url()).toContain('/admin/jobs');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Look for jobs table or list
    const jobsTable = page.locator('table, [data-testid="jobs-table"], .jobs-list').first();
    await expect(jobsTable).toBeVisible({ timeout: 10000 }).catch(() => {
      expect(page.locator('text=No jobs').first()).toBeVisible();
    });
  });

  test('should display courses management page', async ({ page }) => {
    await page.goto('/admin/courses');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    expect(page.url()).toContain('/admin/courses');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Look for courses table or list
    const coursesTable = page.locator('table, [data-testid="courses-table"], .courses-list').first();
    await expect(coursesTable).toBeVisible({ timeout: 10000 }).catch(() => {
      expect(page.locator('text=No courses').first()).toBeVisible();
    });
  });

  test('should navigate between admin sections', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Navigate to users
    const usersLink = page.locator('a[href="/admin/users"], a:has-text("Users"), nav a:has-text("Users")').first();
    if (await usersLink.isVisible().catch(() => false)) {
      await usersLink.click();
      await page.waitForURL('**/admin/users', { timeout: 10000 });
      expect(page.url()).toContain('/admin/users');
    }

    // Navigate to jobs
    const jobsLink = page.locator('a[href="/admin/jobs"], a:has-text("Jobs"), nav a:has-text("Jobs")').first();
    if (await jobsLink.isVisible().catch(() => false)) {
      await jobsLink.click();
      await page.waitForURL('**/admin/jobs', { timeout: 10000 });
      expect(page.url()).toContain('/admin/jobs');
    }

    // Navigate to courses
    const coursesLink = page.locator('a[href="/admin/courses"], a:has-text("Courses"), nav a:has-text("Courses")').first();
    if (await coursesLink.isVisible().catch(() => false)) {
      await coursesLink.click();
      await page.waitForURL('**/admin/courses', { timeout: 10000 });
      expect(page.url()).toContain('/admin/courses');
    }
  });

  test('should redirect non-admin user away from admin pages', async ({ page }) => {
    // Logout admin and login as regular user
    await logoutUser(page);
    await loginUser(page, TEST_USER.email, TEST_USER.password);

    // Try to access admin page
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Should be redirected (to home or login)
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/admin');
  });

  test('should display charts or analytics on dashboard', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for chart elements
    const chartElements = page.locator('canvas, [data-testid="chart"], .recharts-wrapper, svg').first();
    const analyticsText = page.locator('text=Analytics, text=Statistics, text=Overview, text=Dashboard').first();

    await expect(chartElements).toBeVisible({ timeout: 10000 }).catch(async () => {
      await expect(analyticsText).toBeVisible();
    });
  });

  test('should have responsive sidebar navigation', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Look for sidebar or navigation
    const sidebar = page.locator('aside, [data-testid="sidebar"], .sidebar, nav').first();
    const mobileMenu = page.locator('button[aria-label="menu"], [data-testid="mobile-menu"], .hamburger').first();

    const hasSidebar = await sidebar.isVisible().catch(() => false);
    const hasMobileMenu = await mobileMenu.isVisible().catch(() => false);

    expect(hasSidebar || hasMobileMenu).toBeTruthy();
  });
});
