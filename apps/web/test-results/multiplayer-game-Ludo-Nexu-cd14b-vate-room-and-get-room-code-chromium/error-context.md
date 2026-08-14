# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: multiplayer-game.spec.ts >> Ludo Nexus - Multiplayer Game Flow >> Game Room Creation & Matchmaking >> should create a private room and get room code
- Location: tests/multiplayer-game.spec.ts:8:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/game-modes
Call log:
  - navigating to "http://localhost:3000/game-modes", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Ludo Nexus - Multiplayer Game Flow', () => {
  4   |   // These tests require both the API server (port 3001) and web server (port 3000) running
  5   |   // Run with: pnpm dev in one terminal, then pnpm test:e2e in another
  6   | 
  7   |   test.describe('Game Room Creation & Matchmaking', () => {
  8   |     test('should create a private room and get room code', async ({ page }) => {
  9   |       // This test assumes user is authenticated
  10  |       // In a real test setup, you'd log in first
> 11  |       await page.goto('http://localhost:3000/game-modes');
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/game-modes
  12  |       
  13  |       // Click Private Room
  14  |       await page.click('a[href="/room/create"]');
  15  |       
  16  |       // Should show room creation form
  17  |       await expect(page.locator('h1:has-text("Create Room")')).toBeVisible();
  18  |       
  19  |       // Fill room settings
  20  |       await page.fill('input[name="roomName"]', 'Test Room');
  21  |       await page.selectOption('select[name="maxPlayers"]', '4');
  22  |       await page.fill('input[name="entryFee"]', '100');
  23  |       
  24  |       // Create room
  25  |       await page.click('button:has-text("Create Room")');
  26  |       
  27  |       // Should show room lobby with room code
  28  |       await expect(page.locator('text=/Room Code:/')).toBeVisible();
  29  |       const roomCode = await page.locator('[data-testid="room-code"]').textContent();
  30  |       expect(roomCode).toMatch(/^[A-Z0-9]{6}$/);
  31  |     });
  32  | 
  33  |     test('should join a room via room code', async ({ page }) => {
  34  |       await page.goto('http://localhost:3000/room/join');
  35  |       
  36  |       await expect(page.locator('h1:has-text("Join Room")')).toBeVisible();
  37  |       
  38  |       // Enter room code
  39  |       await page.fill('input[name="roomCode"]', 'ABC123');
  40  |       await page.click('button:has-text("Join Room")');
  41  |       
  42  |       // Should navigate to room lobby
  43  |       await expect(page).toHaveURL(/.*room\/ABC123/);
  44  |     });
  45  |   });
  46  | 
  47  |   test.describe('Game Board - WebSocket Integration', () => {
  48  |     test('should connect to WebSocket and load game state', async ({ page }) => {
  49  |       // Navigate to a game match (requires existing match)
  50  |       // In real tests, you'd create a match via API first
  51  |       const matchId = 'test-match-id';
  52  |       await page.goto(`http://localhost:3000/game/${matchId}`);
  53  |       
  54  |       // Should show loading state initially
  55  |       await expect(page.locator('text=Loading game...')).toBeVisible();
  56  |       
  57  |       // Should connect and show board
  58  |       // Note: This requires a real WebSocket server
  59  |       await page.waitForSelector('[data-testid="game-board"]', { timeout: 10000 });
  60  |       await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
  61  |     });
  62  | 
  63  |     test('should show connection status indicator', async ({ page }) => {
  64  |       const matchId = 'test-match-id';
  65  |       await page.goto(`http://localhost:3000/game/${matchId}`);
  66  |       
  67  |       // Wait for connection
  68  |       await page.waitForSelector('[data-testid="connection-status"]', { timeout: 10000 });
  69  |       
  70  |       // Should show Connected status
  71  |       await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected');
  72  |     });
  73  | 
  74  |     test('should handle reconnection', async ({ page }) => {
  75  |       const matchId = 'test-match-id';
  76  |       await page.goto(`http://localhost:3000/game/${matchId}`);
  77  |       
  78  |       await page.waitForSelector('[data-testid="connection-status"]', { timeout: 10000 });
  79  |       
  80  |       // Simulate disconnection by closing WebSocket
  81  |       await page.evaluate(() => {
  82  |         // This would require access to the WebSocket instance
  83  |         // In a real test, you might mock the WebSocket or use a test server
  84  |       });
  85  |       
  86  |       // Should show reconnecting banner
  87  |       await expect(page.locator('text=Reconnecting...')).toBeVisible({ timeout: 5000 });
  88  |       
  89  |       // Should reconnect automatically
  90  |       await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected', { timeout: 15000 });
  91  |     });
  92  |   });
  93  | 
  94  |   test.describe('Game Actions - Dice Roll & Token Move', () => {
  95  |     test('should roll dice when it\'s player\'s turn', async ({ page }) => {
  96  |       const matchId = 'test-match-id';
  97  |       await page.goto(`http://localhost:3000/game/${matchId}`);
  98  |       
  99  |       await page.waitForSelector('[data-testid="dice"]', { timeout: 10000 });
  100 |       
  101 |       // Click roll dice button
  102 |       await page.click('[data-testid="roll-dice-button"]');
  103 |       
  104 |       // Should show dice animation
  105 |       await expect(page.locator('[data-testid="dice"]').first()).toHaveClass(/rolling/);
  106 |       
  107 |       // Should show result
  108 |       await expect(page.locator('[data-testid="dice-value"]')).toBeVisible({ timeout: 5000 });
  109 |     });
  110 | 
  111 |     test('should highlight legal moves after dice roll', async ({ page }) => {
```