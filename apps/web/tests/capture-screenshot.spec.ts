import { test, expect } from '@playwright/test';

test('capture current home page screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Capture full page screenshot
  await page.screenshot({ 
    path: 'test-results/current-home-page.png', 
    fullPage: true 
  });
  
  // Also capture viewport screenshot
  await page.screenshot({ 
    path: 'test-results/current-home-page-viewport.png', 
    fullPage: false 
  });
  
  // Get page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check key design elements
  const body = page.locator('body');
  const bodyClass = await body.getAttribute('class');
  console.log('Body classes:', bodyClass);
  
  const html = page.locator('html');
  const htmlClass = await html.getAttribute('class');
  console.log('HTML classes:', htmlClass);
  
  // Check for gradient text
  const gradientText = page.locator('.gradient-text').first();
  await expect(gradientText).toBeVisible();
  const gradientTextContent = await gradientText.textContent();
  console.log('Gradient text:', gradientTextContent);
  
  // Check for glass panel
  const glassPanel = page.locator('.glass-panel-strong').first();
  await expect(glassPanel).toBeVisible();
  console.log('Glass panel found');
  
  // Check for neon grid
  const neonGrid = page.locator('.bg-neon-grid').first();
  await expect(neonGrid).toBeAttached();
  console.log('Neon grid attached');
});