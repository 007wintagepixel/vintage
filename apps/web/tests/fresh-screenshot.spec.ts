import { test, expect } from '@playwright/test';

test('capture fresh home page screenshot for review', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait for animations
  
  // Capture viewport screenshot
  await page.screenshot({ 
    path: 'test-results/fresh-home-viewport.png', 
    fullPage: false 
  });
  
  // Capture full page screenshot
  await page.screenshot({ 
    path: 'test-results/fresh-home-fullpage.png', 
    fullPage: true 
  });
  
  console.log('Fresh screenshots captured from dev server');
});