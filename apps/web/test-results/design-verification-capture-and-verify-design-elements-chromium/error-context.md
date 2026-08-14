# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: design-verification.spec.ts >> capture and verify design elements
- Location: tests/design-verification.spec.ts:3:5

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
  3  | test('capture and verify design elements', async ({ page }) => {
> 4  |   await page.goto('http://localhost:3000');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5  |   await page.waitForLoadState('networkidle');
  6  |   await page.waitForTimeout(2000); // Wait for animations
  7  |   
  8  |   // Capture full page screenshot
  9  |   await page.screenshot({ 
  10 |     path: 'test-results/design-verification.png', 
  11 |     fullPage: true 
  12 |   });
  13 |   
  14 |   // Verify design elements
  15 |   
  16 |   // 1. Check dark mode
  17 |   const html = page.locator('html');
  18 |   await expect(html).toHaveClass(/dark/);
  19 |   
  20 |   // 2. Check body classes
  21 |   const body = page.locator('body');
  22 |   await expect(body).toHaveClass(/bg-background-DEFAULT/);
  23 |   await expect(body).toHaveClass(/bg-mesh/);
  24 |   
  25 |   // 3. Check neon grid
  26 |   const neonGrid = page.locator('.bg-neon-grid');
  27 |   await expect(neonGrid).toBeAttached();
  28 |   
  29 |   // 4. Check gradient radial backgrounds
  30 |   const gradientRadial = page.locator('.bg-gradient-radial');
  31 |   await expect(gradientRadial).toBeAttached();
  32 |   
  33 |   // 5. Check glass panels
  34 |   const glassPanel = page.locator('.glass-panel-strong').first();
  35 |   await expect(glassPanel).toBeVisible();
  36 |   
  37 |   // 6. Check glass cards
  38 |   const glassCard = page.locator('.glass-card-hover');
  39 |   await expect(glassCard.first()).toBeVisible();
  40 |   
  41 |   // 7. Check gradient text
  42 |   const gradientText = page.locator('.gradient-text');
  43 |   await expect(gradientText.first()).toBeVisible();
  44 |   
  45 |   // 8. Check primary glow colors
  46 |   const primaryGlow = page.locator('.text-primary-glow, .bg-primary-glow');
  47 |   await expect(primaryGlow.first()).toBeVisible();
  48 |   
  49 |   // 9. Check animations (Framer Motion)
  50 |   const animatedElements = page.locator('[style*="opacity"], [style*="transform"]');
  51 |   await expect(animatedElements.first()).toBeVisible();
  52 |   
  53 |   // 10. Check typography classes
  54 |   const displayFont = page.locator('.font-display');
  55 |   await expect(displayFont.first()).toBeVisible();
  56 |   
  57 |   // 11. Check responsive classes
  58 |   const responsiveClasses = page.locator('[class*="md:"], [class*="lg:"], [class*="sm:"]');
  59 |   await expect(responsiveClasses.first()).toBeVisible();
  60 |   
  61 |   // 12. Check specific UI elements
  62 |   const heroTitle = page.locator('h1').filter({ hasText: 'Ludo' });
  63 |   await expect(heroTitle).toBeVisible();
  64 |   
  65 |   const ctaButton = page.locator('a[href="/register"]').first();
  66 |   await expect(ctaButton).toBeVisible();
  67 |   
  68 |   const nav = page.locator('nav');
  69 |   await expect(nav).toBeVisible();
  70 |   
  71 |   console.log('All design elements verified!');
  72 | });
```