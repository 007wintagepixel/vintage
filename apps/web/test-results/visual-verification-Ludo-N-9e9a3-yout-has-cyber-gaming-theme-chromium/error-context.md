# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-verification.spec.ts >> Ludo Nexus - Visual Verification >> should verify dashboard layout has cyber-gaming theme
- Location: tests/visual-verification.spec.ts:114:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Ludo Nexus - Visual Verification', () => {
  4   |   test.beforeEach(async ({ page }) => {
> 5   |     await page.goto('http://localhost:3000');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  6   |   });
  7   | 
  8   |   test('should capture home page screenshot', async ({ page }) => {
  9   |     await page.waitForLoadState('networkidle');
  10  |     await page.screenshot({ path: 'test-results/home-page.png', fullPage: true });
  11  |   });
  12  | 
  13  |   test('should capture login page screenshot', async ({ page }) => {
  14  |     await page.goto('http://localhost:3000/login');
  15  |     await page.waitForLoadState('networkidle');
  16  |     await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });
  17  |   });
  18  | 
  19  |   test('should capture register page screenshot', async ({ page }) => {
  20  |     await page.goto('http://localhost:3000/register');
  21  |     await page.waitForLoadState('networkidle');
  22  |     await page.screenshot({ path: 'test-results/register-page.png', fullPage: true });
  23  |   });
  24  | 
  25  |   test('should capture game modes page screenshot', async ({ page }) => {
  26  |     await page.goto('http://localhost:3000/game-modes');
  27  |     await page.waitForLoadState('networkidle');
  28  |     await page.screenshot({ path: 'test-results/game-modes-page.png', fullPage: true });
  29  |   });
  30  | 
  31  |   test('should capture profile page screenshot', async ({ page }) => {
  32  |     await page.goto('http://localhost:3000/profile');
  33  |     await page.waitForLoadState('networkidle');
  34  |     await page.screenshot({ path: 'test-results/profile-page.png', fullPage: true });
  35  |   });
  36  | 
  37  |   test('should capture wallet page screenshot', async ({ page }) => {
  38  |     await page.goto('http://localhost:3000/wallet');
  39  |     await page.waitForLoadState('networkidle');
  40  |     await page.screenshot({ path: 'test-results/wallet-page.png', fullPage: true });
  41  |   });
  42  | 
  43  |   test('should capture matches page screenshot', async ({ page }) => {
  44  |     await page.goto('http://localhost:3000/matches');
  45  |     await page.waitForLoadState('networkidle');
  46  |     await page.screenshot({ path: 'test-results/matches-page.png', fullPage: true });
  47  |   });
  48  | 
  49  |   test('should capture friends page screenshot', async ({ page }) => {
  50  |     await page.goto('http://localhost:3000/friends');
  51  |     await page.waitForLoadState('networkidle');
  52  |     await page.screenshot({ path: 'test-results/friends-page.png', fullPage: true });
  53  |   });
  54  | 
  55  |   test('should capture tournaments page screenshot', async ({ page }) => {
  56  |     await page.goto('http://localhost:3000/tournaments');
  57  |     await page.waitForLoadState('networkidle');
  58  |     await page.screenshot({ path: 'test-results/tournaments-page.png', fullPage: true });
  59  |   });
  60  | 
  61  |   test('should capture settings page screenshot', async ({ page }) => {
  62  |     await page.goto('http://localhost:3000/settings');
  63  |     await page.waitForLoadState('networkidle');
  64  |     await page.screenshot({ path: 'test-results/settings-page.png', fullPage: true });
  65  |   });
  66  | 
  67  |   test('should verify cyber-gaming theme classes on home page', async ({ page }) => {
  68  |         await page.goto('http://localhost:3000');
  69  |         await page.waitForLoadState('networkidle');
  70  |       
  71  |         // Check for key cyber-gaming classes on html element (dark mode is on html)
  72  |         const html = page.locator('html');
  73  |         await expect(html).toHaveClass(/dark/);
  74  |       
  75  |         // Check body classes
  76  |         const body = page.locator('body');
  77  |         await expect(body).toHaveClass(/bg-background-DEFAULT/);
  78  |         await expect(body).toHaveClass(/bg-mesh/);
  79  |       
  80  |         // Check for neon grid background (present but low opacity)
  81  |         const neonGrid = page.locator('.bg-neon-grid');
  82  |         await expect(neonGrid).toBeAttached();
  83  |       
  84  |         // Check for gradient radial backgrounds
  85  |         const gradientRadial = page.locator('.bg-gradient-radial');
  86  |         await expect(gradientRadial).toBeAttached();
  87  |       
  88  |         // Check for glass panel classes
  89  |         const glassPanel = page.locator('.glass-panel-strong, .glass-card-strong, .glass-card-hover');
  90  |         await expect(glassPanel.first()).toBeVisible();
  91  |       
  92  |         // Check for gradient text
  93  |         const gradientText = page.locator('.gradient-text').first();
  94  |         await expect(gradientText).toBeVisible();
  95  |       });
  96  | 
  97  |   test('should verify cyber-gaming theme classes on game modes page', async ({ page }) => {
  98  |     await page.goto('http://localhost:3000/game-modes');
  99  |     await page.waitForLoadState('networkidle');
  100 |     
  101 |     // Check for html dark class
  102 |     const html = page.locator('html');
  103 |     await expect(html).toHaveClass(/dark/);
  104 |     
  105 |     // Check for glass card hover
```