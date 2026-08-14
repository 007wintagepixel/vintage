# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-view.spec.ts >> live view of home page with animations
- Location: tests/live-view.spec.ts:3:5

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
  3  | test('live view of home page with animations', async ({ page }) => {
> 4  |   await page.goto('http://localhost:3000');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5  |   await page.waitForLoadState('networkidle');
  6  |   
  7  |   // Wait for initial animations
  8  |   await page.waitForTimeout(3000);
  9  |   
  10 |   // Capture viewport screenshot
  11 |   await page.screenshot({ 
  12 |     path: 'test-results/live-home-viewport.png', 
  13 |     fullPage: false 
  14 |   });
  15 |   
  16 |   // Scroll down to capture more
  17 |   await page.mouse.wheel(0, 800);
  18 |   await page.waitForTimeout(1000);
  19 |   await page.screenshot({ 
  20 |     path: 'test-results/live-home-scrolled.png', 
  21 |     fullPage: false 
  22 |   });
  23 |   
  24 |   // Scroll more
  25 |   await page.mouse.wheel(0, 800);
  26 |   await page.waitForTimeout(1000);
  27 |   await page.screenshot({ 
  28 |     path: 'test-results/live-home-scrolled2.png', 
  29 |     fullPage: false 
  30 |   });
  31 |   
  32 |   console.log('Live view screenshots captured');
  33 | });
```