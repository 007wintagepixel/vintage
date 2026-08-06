import { test, expect } from '@playwright/test';

test.describe('Ludo Nexus - Visual Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should capture home page screenshot', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/home-page.png', fullPage: true });
  });

  test('should capture login page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });
  });

  test('should capture register page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/register-page.png', fullPage: true });
  });

  test('should capture game modes page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/game-modes');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/game-modes-page.png', fullPage: true });
  });

  test('should capture profile page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/profile-page.png', fullPage: true });
  });

  test('should capture wallet page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/wallet');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/wallet-page.png', fullPage: true });
  });

  test('should capture matches page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/matches');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/matches-page.png', fullPage: true });
  });

  test('should capture friends page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/friends');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/friends-page.png', fullPage: true });
  });

  test('should capture tournaments page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/tournaments');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/tournaments-page.png', fullPage: true });
  });

  test('should capture settings page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/settings');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/settings-page.png', fullPage: true });
  });

  test('should verify cyber-gaming theme classes on home page', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');
      
        // Check for key cyber-gaming classes on html element (dark mode is on html)
        const html = page.locator('html');
        await expect(html).toHaveClass(/dark/);
      
        // Check body classes
        const body = page.locator('body');
        await expect(body).toHaveClass(/bg-background-DEFAULT/);
        await expect(body).toHaveClass(/bg-mesh/);
      
        // Check for neon grid background (present but low opacity)
        const neonGrid = page.locator('.bg-neon-grid');
        await expect(neonGrid).toBeAttached();
      
        // Check for gradient radial backgrounds
        const gradientRadial = page.locator('.bg-gradient-radial');
        await expect(gradientRadial).toBeAttached();
      
        // Check for glass panel classes
        const glassPanel = page.locator('.glass-panel-strong, .glass-card-strong, .glass-card-hover');
        await expect(glassPanel.first()).toBeVisible();
      
        // Check for gradient text
        const gradientText = page.locator('.gradient-text').first();
        await expect(gradientText).toBeVisible();
      });

  test('should verify cyber-gaming theme classes on game modes page', async ({ page }) => {
    await page.goto('http://localhost:3000/game-modes');
    await page.waitForLoadState('networkidle');
    
    // Check for html dark class
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Check for glass card hover
    const glassCardHover = page.locator('.glass-card-hover');
    await expect(glassCardHover.first()).toBeVisible();
    
    // Check for primary glow colors
    const primaryGlow = page.locator('.text-primary-glow, .bg-primary-glow');
    await expect(primaryGlow.first()).toBeVisible();
  });

  test('should verify dashboard layout has cyber-gaming theme', async ({ page }) => {
    await page.goto('http://localhost:3000/profile');
    await page.waitForLoadState('networkidle');
    
    // Check for html dark class
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Check for dashboard navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check for glass panel
    const glassPanel = page.locator('.glass-panel-strong');
    await expect(glassPanel).toBeVisible();
    
    // Check for gradient text
    const gradientText = page.locator('.gradient-text').first();
    await expect(gradientText).toBeVisible();
  });
});