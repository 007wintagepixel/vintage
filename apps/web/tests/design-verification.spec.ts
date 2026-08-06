import { test, expect } from '@playwright/test';

test('capture and verify design elements', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait for animations
  
  // Capture full page screenshot
  await page.screenshot({ 
    path: 'test-results/design-verification.png', 
    fullPage: true 
  });
  
  // Verify design elements
  
  // 1. Check dark mode
  const html = page.locator('html');
  await expect(html).toHaveClass(/dark/);
  
  // 2. Check body classes
  const body = page.locator('body');
  await expect(body).toHaveClass(/bg-background-DEFAULT/);
  await expect(body).toHaveClass(/bg-mesh/);
  
  // 3. Check neon grid
  const neonGrid = page.locator('.bg-neon-grid');
  await expect(neonGrid).toBeAttached();
  
  // 4. Check gradient radial backgrounds
  const gradientRadial = page.locator('.bg-gradient-radial');
  await expect(gradientRadial).toBeAttached();
  
  // 5. Check glass panels
  const glassPanel = page.locator('.glass-panel-strong').first();
  await expect(glassPanel).toBeVisible();
  
  // 6. Check glass cards
  const glassCard = page.locator('.glass-card-hover');
  await expect(glassCard.first()).toBeVisible();
  
  // 7. Check gradient text
  const gradientText = page.locator('.gradient-text');
  await expect(gradientText.first()).toBeVisible();
  
  // 8. Check primary glow colors
  const primaryGlow = page.locator('.text-primary-glow, .bg-primary-glow');
  await expect(primaryGlow.first()).toBeVisible();
  
  // 9. Check animations (Framer Motion)
  const animatedElements = page.locator('[style*="opacity"], [style*="transform"]');
  await expect(animatedElements.first()).toBeVisible();
  
  // 10. Check typography classes
  const displayFont = page.locator('.font-display');
  await expect(displayFont.first()).toBeVisible();
  
  // 11. Check responsive classes
  const responsiveClasses = page.locator('[class*="md:"], [class*="lg:"], [class*="sm:"]');
  await expect(responsiveClasses.first()).toBeVisible();
  
  // 12. Check specific UI elements
  const heroTitle = page.locator('h1').filter({ hasText: 'Ludo' });
  await expect(heroTitle).toBeVisible();
  
  const ctaButton = page.locator('a[href="/register"]').first();
  await expect(ctaButton).toBeVisible();
  
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
  
  console.log('All design elements verified!');
});