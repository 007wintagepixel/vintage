# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fresh-screenshot.spec.ts >> capture fresh home page screenshot for review
- Location: tests/fresh-screenshot.spec.ts:3:5

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
  3  | test('capture fresh home page screenshot for review', async ({ page }) => {
> 4  |   await page.goto('http://localhost:3000');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5  |   await page.waitForLoadState('networkidle');
  6  |   await page.waitForTimeout(2000); // Wait for animations
  7  |   
  8  |   // Capture viewport screenshot
  9  |   await page.screenshot({ 
  10 |     path: 'test-results/fresh-home-viewport.png', 
  11 |     fullPage: false 
  12 |   });
  13 |   
  14 |   // Capture full page screenshot
  15 |   await page.screenshot({ 
  16 |     path: 'test-results/fresh-home-fullpage.png', 
  17 |     fullPage: true 
  18 |   });
  19 |   
  20 |   console.log('Fresh screenshots captured from dev server');
  21 | });
```