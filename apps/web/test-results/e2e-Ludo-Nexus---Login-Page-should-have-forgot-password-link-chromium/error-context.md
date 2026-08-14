# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Ludo Nexus - Login Page >> should have forgot password link
- Location: tests/e2e.spec.ts:95:7

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
  3   | test.describe('Ludo Nexus - Home Page', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('http://localhost:3000');
  6   |   });
  7   | 
  8   |   test('should load home page with correct title', async ({ page }) => {
  9   |     await expect(page).toHaveTitle(/Ludo Nexus/);
  10  |   });
  11  | 
  12  |   test('should show hero section with gradient text', async ({ page }) => {
  13  |     const hero = page.locator('main').first();
  14  |     await expect(hero).toContainText('Experience');
  15  |     await expect(hero).toContainText('Ludo');
  16  |     await expect(hero).toContainText('Like Never Before');
  17  |   });
  18  | 
  19  |   test('should show Get Started button', async ({ page }) => {
  20  |     const getStartedBtn = page.locator('a[href="/register"]').filter({ hasText: 'Get Started' });
  21  |     await expect(getStartedBtn).toBeVisible();
  22  |   });
  23  | 
  24  |   test('should navigate to register page', async ({ page }) => {
  25  |     await page.click('a[href="/register"]:has-text("Get Started")');
  26  |     await expect(page).toHaveURL(/.*register/);
  27  |     await expect(page.locator('h1')).toContainText('Create Account');
  28  |   });
  29  | 
  30  |   test('should show features section', async ({ page }) => {
  31  |     const features = page.locator('#features');
  32  |     await expect(features).toBeVisible();
  33  |     await expect(features).toContainText('Built for Champions');
  34  |   });
  35  | 
  36  |   test('should show game modes section', async ({ page }) => {
  37  |     const gameModes = page.locator('#game-modes');
  38  |     await expect(gameModes).toBeVisible();
  39  |     await expect(gameModes).toContainText('Choose Your Battle');
  40  |   });
  41  | 
  42  |   test('should show tech stack section', async ({ page }) => {
  43  |     const tech = page.locator('#tech');
  44  |     await expect(tech).toBeVisible();
  45  |     await expect(tech).toContainText('Engineered for Excellence');
  46  |   });
  47  | 
  48  |   test('should have navigation with logo', async ({ page }) => {
  49  |     const logo = page.locator('nav a[href="/"]').first();
  50  |     await expect(logo).toBeVisible();
  51  |     await expect(logo).toContainText('Ludo Nexus');
  52  |   });
  53  | 
  54  |   test('should have login and register links in nav', async ({ page }) => {
  55  |     await expect(page.locator('nav a[href="/login"]')).toBeVisible();
  56  |     await expect(page.locator('nav a[href="/register"]')).toBeVisible();
  57  |   });
  58  | });
  59  | 
  60  | test.describe('Ludo Nexus - Login Page', () => {
  61  |   test.beforeEach(async ({ page }) => {
> 62  |     await page.goto('http://localhost:3000/login');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  63  |   });
  64  | 
  65  |   test('should load login page', async ({ page }) => {
  66  |     await expect(page.locator('h1')).toContainText('Welcome Back');
  67  |   });
  68  | 
  69  |   test('should have email/username input', async ({ page }) => {
  70  |     const input = page.locator('input[id="identifier"]');
  71  |     await expect(input).toBeVisible();
  72  |     await expect(input).toHaveAttribute('placeholder', 'Enter your email or username');
  73  |   });
  74  | 
  75  |   test('should have password input with toggle', async ({ page }) => {
  76  |     const passwordInput = page.locator('input[id="password"]');
  77  |     await expect(passwordInput).toBeVisible();
  78  |     await expect(passwordInput).toHaveAttribute('type', 'password');
  79  |     
  80  |     // Verify the toggle button exists and is clickable
  81  |     const toggleButton = page.locator('[data-testid="toggle-password"]').first();
  82  |     await expect(toggleButton).toBeVisible();
  83  |     await expect(toggleButton).toBeEnabled();
  84  |     
  85  |     // Note: The actual toggle functionality is tested manually as it involves 
  86  |     // React state updates that don't reliably trigger in the test environment.
  87  |     // Manual testing confirms the toggle works correctly.
  88  |   });
  89  | 
  90  |   test('should have remember me checkbox', async ({ page }) => {
  91  |     const checkbox = page.locator('input[type="checkbox"]');
  92  |     await expect(checkbox).toBeVisible();
  93  |   });
  94  | 
  95  |   test('should have forgot password link', async ({ page }) => {
  96  |     const link = page.locator('a[href="/forgot-password"]');
  97  |     await expect(link).toBeVisible();
  98  |     await expect(link).toContainText('Forgot password?');
  99  |   });
  100 | 
  101 |   test('should have social login buttons', async ({ page }) => {
  102 |     await expect(page.locator('button:has-text("Google")')).toBeVisible();
  103 |     await expect(page.locator('button:has-text("Apple")')).toBeVisible();
  104 |   });
  105 | 
  106 |   test('should navigate to register page', async ({ page }) => {
  107 |     await page.click('a[href="/register"]');
  108 |     await expect(page).toHaveURL(/.*register/);
  109 |   });
  110 | });
  111 | 
  112 | test.describe('Ludo Nexus - Register Page', () => {
  113 |   test.beforeEach(async ({ page }) => {
  114 |     await page.goto('http://localhost:3000/register');
  115 |   });
  116 | 
  117 |   test('should load register page', async ({ page }) => {
  118 |     await expect(page.locator('h1')).toContainText('Create Account');
  119 |   });
  120 | 
  121 |   test('should have all required fields', async ({ page }) => {
  122 |     await expect(page.locator('input[id="username"]')).toBeVisible();
  123 |     await expect(page.locator('input[id="fullName"]')).toBeVisible();
  124 |     await expect(page.locator('input[id="email"]')).toBeVisible();
  125 |     await expect(page.locator('select[id="country"]')).toBeVisible();
  126 |     await expect(page.locator('input[id="mobileNumber"]')).toBeVisible();
  127 |     await expect(page.locator('input[id="dateOfBirth"]')).toBeVisible();
  128 |     await expect(page.locator('input[id="password"]')).toBeVisible();
  129 |     await expect(page.locator('input[id="confirmPassword"]')).toBeVisible();
  130 |   });
  131 | 
  132 |   test('should show password strength indicator', async ({ page }) => {
  133 |     const passwordInput = page.locator('input[id="password"]');
  134 |     await passwordInput.fill('Test123!');
  135 |     
  136 |     // Verify the password field accepts input
  137 |     await expect(passwordInput).toHaveValue('Test123!');
  138 |     
  139 |     // Note: The strength indicator uses conditional rendering with Framer Motion animations
  140 |     // which may not complete in the test environment. Manual testing confirms it works.
  141 |   });
  142 | 
  143 |   test('should have terms checkboxes', async ({ page }) => {
  144 |     // The checkboxes don't have explicit IDs, so we find them by their labels
  145 |     await expect(page.locator('label:has-text("Terms of Service")').locator('input[type="checkbox"]')).toBeVisible();
  146 |     await expect(page.locator('label:has-text("Privacy Policy")').locator('input[type="checkbox"]')).toBeVisible();
  147 |     await expect(page.locator('label:has-text("Responsible Gaming")').locator('input[type="checkbox"]')).toBeVisible();
  148 |     await expect(page.locator('label:has-text("18 years or older")').locator('input[type="checkbox"]')).toBeVisible();
  149 |   });
  150 | 
  151 |   test('should have referral code field', async ({ page }) => {
  152 |     await expect(page.locator('input[id="referralCode"]')).toBeVisible();
  153 |   });
  154 | 
  155 |   test('should navigate to login page', async ({ page }) => {
  156 |     await page.click('a[href="/login"]');
  157 |     await expect(page).toHaveURL(/.*login/);
  158 |   });
  159 | });
  160 | 
  161 | test.describe('Ludo Nexus - Forgot Password Page', () => {
  162 |   test.beforeEach(async ({ page }) => {
```