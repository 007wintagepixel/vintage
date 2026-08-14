# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: console-errors.spec.ts >> Ludo Nexus - Console Error Check >> login page should have no console errors
- Location: tests/console-errors.spec.ts:35:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Ludo Nexus - Console Error Check', () => {
  4   |   test('home page should have no console errors', async ({ page }) => {
  5   |     const errors: string[] = [];
  6   |     page.on('console', msg => {
  7   |       if (msg.type() === 'error') {
  8   |         errors.push(msg.text());
  9   |       }
  10  |     });
  11  |     
  12  |     page.on('pageerror', error => {
  13  |       errors.push(error.message);
  14  |     });
  15  | 
  16  |     await page.goto('http://localhost:3000');
  17  |     await page.waitForLoadState('networkidle');
  18  |     await page.waitForTimeout(2000); // Wait for any async errors
  19  |     
  20  |     // Filter out known harmless errors
  21  |     const filteredErrors = errors.filter(e => 
  22  |       !e.includes('favicon') && 
  23  |       !e.includes('manifest') &&
  24  |       !e.includes('serviceWorker') &&
  25  |       !e.includes('Extension')
  26  |     );
  27  |     
  28  |     if (filteredErrors.length > 0) {
  29  |       console.log('Console errors found:', filteredErrors);
  30  |     }
  31  |     
  32  |     expect(filteredErrors).toHaveLength(0);
  33  |   });
  34  | 
  35  |   test('login page should have no console errors', async ({ page }) => {
  36  |     const errors: string[] = [];
  37  |     page.on('console', msg => {
  38  |       if (msg.type() === 'error') {
  39  |         errors.push(msg.text());
  40  |       }
  41  |     });
  42  |     
  43  |     page.on('pageerror', error => {
  44  |       errors.push(error.message);
  45  |     });
  46  | 
> 47  |     await page.goto('http://localhost:3000/login');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  48  |     await page.waitForLoadState('networkidle');
  49  |     await page.waitForTimeout(1000);
  50  |     
  51  |     const filteredErrors = errors.filter(e => 
  52  |       !e.includes('favicon') && 
  53  |       !e.includes('manifest') &&
  54  |       !e.includes('serviceWorker') &&
  55  |       !e.includes('Extension')
  56  |     );
  57  |     
  58  |     if (filteredErrors.length > 0) {
  59  |       console.log('Login page console errors:', filteredErrors);
  60  |     }
  61  |     
  62  |     expect(filteredErrors).toHaveLength(0);
  63  |   });
  64  | 
  65  |   test('game modes page should have no console errors', async ({ page }) => {
  66  |     const errors: string[] = [];
  67  |     page.on('console', msg => {
  68  |       if (msg.type() === 'error') {
  69  |         errors.push(msg.text());
  70  |       }
  71  |     });
  72  |     
  73  |     page.on('pageerror', error => {
  74  |       errors.push(error.message);
  75  |     });
  76  | 
  77  |     await page.goto('http://localhost:3000/game-modes');
  78  |     await page.waitForLoadState('networkidle');
  79  |     await page.waitForTimeout(1000);
  80  |     
  81  |     const filteredErrors = errors.filter(e => 
  82  |       !e.includes('favicon') && 
  83  |       !e.includes('manifest') &&
  84  |       !e.includes('serviceWorker') &&
  85  |       !e.includes('Extension')
  86  |     );
  87  |     
  88  |     if (filteredErrors.length > 0) {
  89  |       console.log('Game modes page console errors:', filteredErrors);
  90  |     }
  91  |     
  92  |     expect(filteredErrors).toHaveLength(0);
  93  |   });
  94  | 
  95  |   test('dashboard profile page should have no console errors', async ({ page }) => {
  96  |     const errors: string[] = [];
  97  |     page.on('console', msg => {
  98  |       if (msg.type() === 'error') {
  99  |         errors.push(msg.text());
  100 |       }
  101 |     });
  102 |     
  103 |     page.on('pageerror', error => {
  104 |       errors.push(error.message);
  105 |     });
  106 | 
  107 |     await page.goto('http://localhost:3000/profile');
  108 |     await page.waitForLoadState('networkidle');
  109 |     await page.waitForTimeout(1000);
  110 |     
  111 |     const filteredErrors = errors.filter(e => 
  112 |       !e.includes('favicon') && 
  113 |       !e.includes('manifest') &&
  114 |       !e.includes('serviceWorker') &&
  115 |       !e.includes('Extension')
  116 |     );
  117 |     
  118 |     if (filteredErrors.length > 0) {
  119 |       console.log('Profile page console errors:', filteredErrors);
  120 |     }
  121 |     
  122 |     expect(filteredErrors).toHaveLength(0);
  123 |   });
  124 | });
```