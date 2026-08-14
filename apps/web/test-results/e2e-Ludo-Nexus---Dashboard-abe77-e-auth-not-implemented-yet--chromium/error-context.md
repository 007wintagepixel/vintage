# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Ludo Nexus - Dashboard Pages (Protected) >> should load wallet page (auth not implemented yet)
- Location: tests/e2e.spec.ts:216:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/wallet
Call log:
  - navigating to "http://localhost:3000/wallet", waiting until "load"

```

# Test source

```ts
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
  163 |     await page.goto('http://localhost:3000/forgot-password');
  164 |   });
  165 | 
  166 |   test('should load forgot password page', async ({ page }) => {
  167 |     await expect(page.locator('h1')).toContainText('Forgot Password?');
  168 |   });
  169 | 
  170 |   test('should have email input', async ({ page }) => {
  171 |     const input = page.locator('input[id="identifier"]');
  172 |     await expect(input).toBeVisible();
  173 |     await expect(input).toHaveAttribute('type', 'email');
  174 |   });
  175 | 
  176 |   test('should have back to login link', async ({ page }) => {
  177 |     const link = page.locator('a[href="/login"]').last();
  178 |     await expect(link).toBeVisible();
  179 |   });
  180 | });
  181 | 
  182 | test.describe('Ludo Nexus - Game Modes Page', () => {
  183 |   test.beforeEach(async ({ page }) => {
  184 |     await page.goto('http://localhost:3000/game-modes');
  185 |   });
  186 | 
  187 |   test('should load game modes page', async ({ page }) => {
  188 |     await expect(page.locator('h1:has-text("Choose Your Battle")')).toBeVisible();
  189 |   });
  190 | 
  191 |   test('should show all game mode cards', async ({ page }) => {
  192 |     const cards = page.locator('[href^="/game-modes/"]');
  193 |     await expect(cards.first()).toBeVisible();
  194 |   });
  195 | 
  196 |   test('should show Quick Match mode', async ({ page }) => {
  197 |     await expect(page.locator('h3:has-text("Quick Match")')).toBeVisible();
  198 |   });
  199 | 
  200 |   test('should show Private Room mode', async ({ page }) => {
  201 |     await expect(page.locator('h3:has-text("Private Room")')).toBeVisible();
  202 |   });
  203 | 
  204 |   test('should show Tournaments mode', async ({ page }) => {
  205 |     await expect(page.locator('h3:has-text("Tournaments")')).toBeVisible();
  206 |   });
  207 | });
  208 | 
  209 | test.describe('Ludo Nexus - Dashboard Pages (Protected)', () => {
  210 |   test('should load profile page (auth not implemented yet)', async ({ page }) => {
  211 |     await page.goto('http://localhost:3000/profile');
  212 |     // Should load the page (auth not implemented yet)
  213 |     await expect(page.locator('h1')).toContainText('Profile');
  214 |   });
  215 | 
  216 |   test('should load wallet page (auth not implemented yet)', async ({ page }) => {
> 217 |     await page.goto('http://localhost:3000/wallet');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/wallet
  218 |     await expect(page.locator('h1')).toContainText('Wallet');
  219 |   });
  220 | 
  221 |   test('should load matches page (auth not implemented yet)', async ({ page }) => {
  222 |     await page.goto('http://localhost:3000/matches');
  223 |     await expect(page.locator('h1')).toContainText('Match History');
  224 |   });
  225 | 
  226 |   test('should load friends page (auth not implemented yet)', async ({ page }) => {
  227 |     await page.goto('http://localhost:3000/friends');
  228 |     await expect(page.locator('h1')).toContainText('Friends');
  229 |   });
  230 | 
  231 |   test('should load tournaments page (auth not implemented yet)', async ({ page }) => {
  232 |     await page.goto('http://localhost:3000/tournaments');
  233 |     await expect(page.locator('h1')).toContainText('Tournaments');
  234 |   });
  235 | 
  236 |   test('should load settings page (auth not implemented yet)', async ({ page }) => {
  237 |     await page.goto('http://localhost:3000/settings');
  238 |     await expect(page.locator('h1')).toContainText('Settings');
  239 |   });
  240 | });
  241 | 
  242 | test.describe('Ludo Nexus - PWA Features', () => {
  243 |   test('should have manifest.json', async ({ page }) => {
  244 |     const response = await page.request.get('http://localhost:3000/manifest.json');
  245 |     expect(response.ok()).toBeTruthy();
  246 |     const manifest = await response.json();
  247 |     expect(manifest.name).toBe('Ludo Nexus');
  248 |     expect(manifest.short_name).toBe('Ludo Nexus');
  249 |     expect(manifest.icons.length).toBeGreaterThan(0);
  250 |   });
  251 | 
  252 |   test('should have service worker', async ({ page }) => {
  253 |     const swResponse = await page.request.get('http://localhost:3000/sw.js');
  254 |     expect(swResponse.ok()).toBeTruthy();
  255 |   });
  256 | 
  257 |   test('should have offline.html', async ({ page }) => {
  258 |     const response = await page.request.get('http://localhost:3000/offline.html');
  259 |     expect(response.ok()).toBeTruthy();
  260 |     const html = await response.text();
  261 |     expect(html).toContain('You\'re Offline');
  262 |   });
  263 | 
  264 |   test('should have PWA meta tags', async ({ page }) => {
  265 |     await page.goto('http://localhost:3000');
  266 |     
  267 |     // Check for PWA meta tags (using first() to handle duplicates)
  268 |     await expect(page.locator('meta[name="mobile-web-app-capable"]').first()).toHaveAttribute('content', 'yes');
  269 |     await expect(page.locator('meta[name="apple-mobile-web-app-capable"]').first()).toHaveAttribute('content', 'yes');
  270 |     await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', '#0C0A09');
  271 |     await expect(page.locator('link[rel="manifest"]').first()).toHaveAttribute('href', '/manifest.json');
  272 |   });
  273 | });
  274 | 
  275 | test.describe('Ludo Nexus - Responsive Design', () => {
  276 |   test('should work on mobile viewport', async ({ page }) => {
  277 |     await page.setViewportSize({ width: 375, height: 667 });
  278 |     await page.goto('http://localhost:3000');
  279 |     
  280 |     // Mobile nav should be visible
  281 |     await expect(page.locator('nav')).toBeVisible();
  282 |     await expect(page.locator('main')).toBeVisible();
  283 |   });
  284 | 
  285 |   test('should work on tablet viewport', async ({ page }) => {
  286 |     await page.setViewportSize({ width: 768, height: 1024 });
  287 |     await page.goto('http://localhost:3000');
  288 |     
  289 |     await expect(page.locator('nav')).toBeVisible();
  290 |   });
  291 | 
  292 |   test('should work on desktop viewport', async ({ page }) => {
  293 |     await page.setViewportSize({ width: 1920, height: 1080 });
  294 |     await page.goto('http://localhost:3000');
  295 |     
  296 |     await expect(page.locator('nav')).toBeVisible();
  297 |   });
  298 | });
  299 | 
  300 | test.describe('Ludo Nexus - Accessibility', () => {
  301 |   test('should have proper heading hierarchy', async ({ page }) => {
  302 |     await page.goto('http://localhost:3000');
  303 |     
  304 |     const h1 = page.locator('h1');
  305 |     await expect(h1).toBeVisible();
  306 |   });
  307 | 
  308 |   test('should have alt text for images', async ({ page }) => {
  309 |     await page.goto('http://localhost:3000');
  310 |     
  311 |     const images = page.locator('img');
  312 |     const count = await images.count();
  313 |     
  314 |     for (let i = 0; i < count; i++) {
  315 |       const img = images.nth(i);
  316 |       const alt = await img.getAttribute('alt');
  317 |       expect(alt).toBeTruthy();
```