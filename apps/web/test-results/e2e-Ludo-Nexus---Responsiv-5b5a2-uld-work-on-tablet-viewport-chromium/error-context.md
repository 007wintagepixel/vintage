# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Ludo Nexus - Responsive Design >> should work on tablet viewport
- Location: tests/e2e.spec.ts:285:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
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
  217 |     await page.goto('http://localhost:3000/wallet');
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
> 287 |     await page.goto('http://localhost:3000');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
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
  318 |     }
  319 |   });
  320 | 
  321 |   test('should have focusable elements', async ({ page }) => {
  322 |     await page.goto('http://localhost:3000/login');
  323 |     
  324 |     // Tab through elements
  325 |     await page.keyboard.press('Tab');
  326 |     const focused = await page.evaluate(() => document.activeElement?.tagName);
  327 |     expect(focused).toBeTruthy();
  328 |   });
  329 | 
  330 |   test('should have proper form labels', async ({ page }) => {
  331 |     await page.goto('http://localhost:3000/login');
  332 |     
  333 |     const emailLabel = page.locator('label[for="identifier"]');
  334 |     await expect(emailLabel).toBeVisible();
  335 |     
  336 |     const passwordLabel = page.locator('label[for="password"]');
  337 |     await expect(passwordLabel).toBeVisible();
  338 |   });
  339 | });
```