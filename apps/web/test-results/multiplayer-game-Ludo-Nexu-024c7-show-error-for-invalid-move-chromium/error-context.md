# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: multiplayer-game.spec.ts >> Ludo Nexus - Multiplayer Game Flow >> Game Actions - Dice Roll & Token Move >> should show error for invalid move
- Location: tests/multiplayer-game.spec.ts:141:9

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/game/test-match-id
Call log:
  - navigating to "http://localhost:3000/game/test-match-id", waiting until "load"

```

# Test source

```ts
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
  112 |       const matchId = 'test-match-id';
  113 |       await page.goto(`http://localhost:3000/game/${matchId}`);
  114 |       
  115 |       await page.waitForSelector('[data-testid="dice"]', { timeout: 10000 });
  116 |       await page.click('[data-testid="roll-dice-button"]');
  117 |       
  118 |       // Wait for legal moves to appear
  119 |       await page.waitForSelector('[data-testid="legal-move-highlight"]', { timeout: 5000 });
  120 |       
  121 |       // Should show highlighted tokens
  122 |       const legalTokens = page.locator('[data-testid="legal-move-highlight"]');
  123 |       await expect(legalTokens.first()).toBeVisible();
  124 |     });
  125 | 
  126 |     test('should move token to valid position', async ({ page }) => {
  127 |       const matchId = 'test-match-id';
  128 |       await page.goto(`http://localhost:3000/game/${matchId}`);
  129 |       
  130 |       await page.waitForSelector('[data-testid="dice"]', { timeout: 10000 });
  131 |       await page.click('[data-testid="roll-dice-button"]');
  132 |       await page.waitForSelector('[data-testid="legal-move-highlight"]', { timeout: 5000 });
  133 |       
  134 |       // Click on a legal token
  135 |       await page.click('[data-testid="legal-move-highlight"]');
  136 |       
  137 |       // Token should move (animation)
  138 |       await expect(page.locator('[data-testid="token-moving"]')).toBeVisible({ timeout: 2000 });
  139 |     });
  140 | 
  141 |     test('should show error for invalid move', async ({ page }) => {
  142 |       const matchId = 'test-match-id';
> 143 |       await page.goto(`http://localhost:3000/game/${matchId}`);
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/game/test-match-id
  144 |       
  145 |       await page.waitForSelector('[data-testid="dice"]', { timeout: 10000 });
  146 |       await page.click('[data-testid="roll-dice-button"]');
  147 |       await page.waitForSelector('[data-testid="legal-move-highlight"]', { timeout: 5000 });
  148 |       
  149 |       // Try to click a non-legal token (if any)
  150 |       // This would require specific game state setup
  151 |     });
  152 |   });
  153 | 
  154 |   test.describe('Game Chat', () => {
  155 |     test('should open chat sidebar', async ({ page }) => {
  156 |       const matchId = 'test-match-id';
  157 |       await page.goto(`http://localhost:3000/game/${matchId}`);
  158 |       
  159 |       await page.waitForSelector('[data-testid="chat-toggle"]', { timeout: 10000 });
  160 |       await page.click('[data-testid="chat-toggle"]');
  161 |       
  162 |       // Chat panel should be visible
  163 |       await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible();
  164 |     });
  165 | 
  166 |     test('should send and receive chat messages', async ({ page }) => {
  167 |       const matchId = 'test-match-id';
  168 |       await page.goto(`http://localhost:3000/game/${matchId}`);
  169 |       
  170 |       await page.waitForSelector('[data-testid="chat-toggle"]', { timeout: 10000 });
  171 |       await page.click('[data-testid="chat-toggle"]');
  172 |       
  173 |       // Type message
  174 |       await page.fill('[data-testid="chat-input"]', 'Hello, good game!');
  175 |       await page.click('[data-testid="chat-send"]');
  176 |       
  177 |       // Message should appear in chat
  178 |       await expect(page.locator('[data-testid="chat-messages"]')).toContainText('Hello, good game!');
  179 |     });
  180 | 
  181 |     test('should show system messages for captures', async ({ page }) => {
  182 |       // This requires a capture to happen
  183 |       // Would need specific game state setup
  184 |     });
  185 |   });
  186 | 
  187 |   test.describe('Game Completion', () => {
  188 |     test('should show game over overlay when match completes', async ({ page }) => {
  189 |       // Requires a completed match
  190 |       const matchId = 'completed-match-id';
  191 |       await page.goto(`http://localhost:3000/game/${matchId}`);
  192 |       
  193 |       // Should show game over overlay
  194 |       await expect(page.locator('[data-testid="game-over-overlay"]')).toBeVisible({ timeout: 10000 });
  195 |       
  196 |       // Should show winner
  197 |       await expect(page.locator('[data-testid="winner-name"]')).toBeVisible();
  198 |       
  199 |       // Should show back to dashboard button
  200 |       await expect(page.locator('[data-testid="back-to-dashboard"]')).toBeVisible();
  201 |     });
  202 | 
  203 |     test('should navigate to dashboard after game over', async ({ page }) => {
  204 |       const matchId = 'completed-match-id';
  205 |       await page.goto(`http://localhost:3000/game/${matchId}`);
  206 |       
  207 |       await page.waitForSelector('[data-testid="game-over-overlay"]', { timeout: 10000 });
  208 |       await page.click('[data-testid="back-to-dashboard"]');
  209 |       
  210 |       await expect(page).toHaveURL(/.*dashboard/);
  211 |     });
  212 |   });
  213 | 
  214 |   test.describe('Player Presence & Disconnection', () => {
  215 |     test('should show disconnected player', async ({ page }) => {
  216 |       // Requires multi-player setup
  217 |     });
  218 | 
  219 |     test('should show reconnected player', async ({ page }) => {
  220 |       // Requires multi-player setup
  221 |     });
  222 |   });
  223 | 
  224 |   test.describe('Spectator Mode', () => {
  225 |     test('should allow spectating a match', async ({ page }) => {
  226 |       // Navigate to spectator view
  227 |       const matchId = 'test-match-id';
  228 |       await page.goto(`http://localhost:3000/spectate/${matchId}`);
  229 |       
  230 |       // Should show board but no dice/controls
  231 |       await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
  232 |       await expect(page.locator('[data-testid="dice"]')).not.toBeVisible();
  233 |     });
  234 |   });
  235 | });
  236 | 
  237 | // Helper function to create test match via API
  238 | async function createTestMatch(page, options = {}) {
  239 |   const response = await page.request.post('http://localhost:3001/api/v1/game/matches', {
  240 |     data: {
  241 |       mode: options.mode || 'vs_human',
  242 |       entryFee: options.entryFee || 100,
  243 |       opponentCount: options.opponentCount || 1,
```