# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: capture-screenshot.spec.ts >> capture current home page screenshot
- Location: tests/capture-screenshot.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('capture current home page screenshot', async ({ page }) => {
> 4  |   await page.goto('http://localhost:3000');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5  |   await page.waitForLoadState('networkidle');
  6  |   await page.waitForTimeout(1000);
  7  |   
  8  |   // Capture full page screenshot
  9  |   await page.screenshot({ 
  10 |     path: 'test-results/current-home-page.png', 
  11 |     fullPage: true 
  12 |   });
  13 |   
  14 |   // Also capture viewport screenshot
  15 |   await page.screenshot({ 
  16 |     path: 'test-results/current-home-page-viewport.png', 
  17 |     fullPage: false 
  18 |   });
  19 |   
  20 |   // Get page title
  21 |   const title = await page.title();
  22 |   console.log('Page title:', title);
  23 |   
  24 |   // Check key design elements
  25 |   const body = page.locator('body');
  26 |   const bodyClass = await body.getAttribute('class');
  27 |   console.log('Body classes:', bodyClass);
  28 |   
  29 |   const html = page.locator('html');
  30 |   const htmlClass = await html.getAttribute('class');
  31 |   console.log('HTML classes:', htmlClass);
  32 |   
  33 |   // Check for gradient text
  34 |   const gradientText = page.locator('.gradient-text').first();
  35 |   await expect(gradientText).toBeVisible();
  36 |   const gradientTextContent = await gradientText.textContent();
  37 |   console.log('Gradient text:', gradientTextContent);
  38 |   
  39 |   // Check for glass panel
  40 |   const glassPanel = page.locator('.glass-panel-strong').first();
  41 |   await expect(glassPanel).toBeVisible();
  42 |   console.log('Glass panel found');
  43 |   
  44 |   // Check for neon grid
  45 |   const neonGrid = page.locator('.bg-neon-grid').first();
  46 |   await expect(neonGrid).toBeAttached();
  47 |   console.log('Neon grid attached');
  48 | });
```