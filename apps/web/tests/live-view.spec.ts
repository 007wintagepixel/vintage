import { test, expect } from '@playwright/test';

test('live view of home page with animations', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Wait for initial animations
  await page.waitForTimeout(3000);
  
  // Capture viewport screenshot
  await page.screenshot({ 
    path: 'test-results/live-home-viewport.png', 
    fullPage: false 
  });
  
  // Scroll down to capture more
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: 'test-results/live-home-scrolled.png', 
    fullPage: false 
  });
  
  // Scroll more
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: 'test-results/live-home-scrolled2.png', 
    fullPage: false 
  });
  
  console.log('Live view screenshots captured');
});