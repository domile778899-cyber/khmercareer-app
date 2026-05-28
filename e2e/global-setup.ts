/**
 * Global Setup for Playwright E2E Tests
 * Prepares test environment before running tests.
 */
import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Log test environment
  console.log('🚀 Starting KhmerCareer E2E Tests');
  console.log(`📍 Base URL: ${config.projects[0]?.use?.baseURL || 'http://localhost:5173'}`);
  console.log(`🌐 Workers: ${config.workers}`);
  console.log(`🔄 Retries: ${config.projects[0]?.retries ?? 0}`);

  // Verify server is reachable
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:5173';
    await page.goto(baseURL, { timeout: 30000, waitUntil: 'domcontentloaded' });
    console.log('✅ Dev server is reachable');
  } catch (error) {
    console.warn('⚠️ Dev server may not be ready yet. Will retry during tests.');
  } finally {
    await browser.close();
  }
}

export default globalSetup;
