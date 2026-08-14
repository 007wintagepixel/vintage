import { test, expect } from '@playwright/test';

test.describe('Ludo Nexus - Multiplayer Game Flow', () => {
  // These tests require both the API server (port 3001) and web server (port 3000) running
  // Run with: pnpm dev in one terminal, then pnpm test:e2e in another

  test.describe('Game Room Creation & Matchmaking', () => {
    test('should create a private room and get room code', async ({ page }) => {
      // This test assumes user is authenticated
      // In a real test setup, you'd log in first
      await page.goto('http://localhost:3000/game-modes');
      
      // Click Private Room
      await page.click('a[href="/room/create"]');
      
      // Should show room creation form
      await expect(page.locator('h1:has-text("Create Room")')).toBeVisible();
      
      // Fill room settings
      await page.fill('input[name="roomName"]', 'Test Room');
      await page.selectOption('select[name="maxPlayers"]', '4');
      await page.fill('input[name="entryFee"]', '100');
      
      // Create room
      await page.click('button:has-text("Create Room")');
      
      // Should show room lobby with room code
      await expect(page.locator('text=/Room Code:/')).toBeVisible();
      const roomCode = await page.locator('[data-testid="room-code"]').textContent();
      expect(roomCode).toMatch(/^[A-Z0-9]{6}$/);
    });

    test('should join a room via room code', async ({ page }) => {
      await page.goto('http://localhost:3000/room/join');
      
      await expect(page.locator('h1:has-text("Join Room")')).toBeVisible();
      
      // Enter room code
      await page.fill('input[name="roomCode"]', 'ABC123');
      await page.click('button:has-text("Join Room")');
      
      // Should navigate to room lobby
      await expect(page).toHaveURL(/.*room\/ABC123/);
    });
  });

  test.describe('Game Board - WebSocket Integration', () => {
    test('should connect to WebSocket and load game state', async ({ page }) => {
      // Navigate to a game match (requires existing match)
      // In real tests, you'd create a match via API first
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      // Should show loading state initially
      await expect(page.locator('text=Loading game...')).toBeVisible();
      
      // Should connect and show board
      // Note: This requires a real WebSocket server
      await page.waitForSelector('[data-testid="game-board"]', { timeout: 10000 });
      await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
    });

    test('should show connection status indicator', async ({ page }) => {
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      // Wait for connection
      await page.waitForSelector('[data-testid="connection-status"]', { timeout: 10000 });
      
      // Should show Connected status
      await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected');
    });

    test('should handle reconnection', async ({ page }) => {
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      await page.waitForSelector('[data-testid="connection-status"]', { timeout: 10000 });
      
      // Simulate disconnection by closing WebSocket
      await page.evaluate(() => {
        // This would require access to the WebSocket instance
        // In a real test, you might mock the WebSocket or use a test server
      });
      
      // Should show reconnecting banner
      await expect(page.locator('text=Reconnecting...')).toBeVisible({ timeout: 5000 });
      
      // Should reconnect automatically
      await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected', { timeout: 15000 });
    });
  });

  test.describe('Game Actions - Dice Roll & Token Move', () => {
    test('should roll dice when it\'s player\'s turn', async ({ page }) => {
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      await page.waitForSelector('[data-testid="dice"]', { timeout: 10000 });
      
      // Click roll dice button
      await page.click('[data-testid="roll-dice-button"]');
      
      // Should show dice animation
      await expect(page.locator('[data-testid="dice"]').first()).toHaveClass(/rolling/);
      
      // Should show result
      await expect(page.locator('[data-testid="dice-value"]')).toBeVisible({ timeout: 5000 });
    });

    test('should highlight legal moves after dice roll', async ({ page }) => {
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      await page.waitForSelector('[data-testid="dice"]', { timeout: 10000 });
      await page.click('[data-testid="roll-dice-button"]');
      
      // Wait for legal moves to appear
      await page.waitForSelector('[data-testid="legal-move-highlight"]', { timeout: 5000 });
      
      // Should show highlighted tokens
      const legalTokens = page.locator('[data-testid="legal-move-highlight"]');
      await expect(legalTokens.first()).toBeVisible();
    });

    test('should move token to valid position', async ({ page }) => {
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      await page.waitForSelector('[data-testid="dice"]', { timeout: 10000 });
      await page.click('[data-testid="roll-dice-button"]');
      await page.waitForSelector('[data-testid="legal-move-highlight"]', { timeout: 5000 });
      
      // Click on a legal token
      await page.click('[data-testid="legal-move-highlight"]');
      
      // Token should move (animation)
      await expect(page.locator('[data-testid="token-moving"]')).toBeVisible({ timeout: 2000 });
    });

    test('should show error for invalid move', async ({ page }) => {
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      await page.waitForSelector('[data-testid="dice"]', { timeout: 10000 });
      await page.click('[data-testid="roll-dice-button"]');
      await page.waitForSelector('[data-testid="legal-move-highlight"]', { timeout: 5000 });
      
      // Try to click a non-legal token (if any)
      // This would require specific game state setup
    });
  });

  test.describe('Game Chat', () => {
    test('should open chat sidebar', async ({ page }) => {
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      await page.waitForSelector('[data-testid="chat-toggle"]', { timeout: 10000 });
      await page.click('[data-testid="chat-toggle"]');
      
      // Chat panel should be visible
      await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible();
    });

    test('should send and receive chat messages', async ({ page }) => {
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      await page.waitForSelector('[data-testid="chat-toggle"]', { timeout: 10000 });
      await page.click('[data-testid="chat-toggle"]');
      
      // Type message
      await page.fill('[data-testid="chat-input"]', 'Hello, good game!');
      await page.click('[data-testid="chat-send"]');
      
      // Message should appear in chat
      await expect(page.locator('[data-testid="chat-messages"]')).toContainText('Hello, good game!');
    });

    test('should show system messages for captures', async ({ page }) => {
      // This requires a capture to happen
      // Would need specific game state setup
    });
  });

  test.describe('Game Completion', () => {
    test('should show game over overlay when match completes', async ({ page }) => {
      // Requires a completed match
      const matchId = 'completed-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      // Should show game over overlay
      await expect(page.locator('[data-testid="game-over-overlay"]')).toBeVisible({ timeout: 10000 });
      
      // Should show winner
      await expect(page.locator('[data-testid="winner-name"]')).toBeVisible();
      
      // Should show back to dashboard button
      await expect(page.locator('[data-testid="back-to-dashboard"]')).toBeVisible();
    });

    test('should navigate to dashboard after game over', async ({ page }) => {
      const matchId = 'completed-match-id';
      await page.goto(`http://localhost:3000/game/${matchId}`);
      
      await page.waitForSelector('[data-testid="game-over-overlay"]', { timeout: 10000 });
      await page.click('[data-testid="back-to-dashboard"]');
      
      await expect(page).toHaveURL(/.*dashboard/);
    });
  });

  test.describe('Player Presence & Disconnection', () => {
    test('should show disconnected player', async ({ page }) => {
      // Requires multi-player setup
    });

    test('should show reconnected player', async ({ page }) => {
      // Requires multi-player setup
    });
  });

  test.describe('Spectator Mode', () => {
    test('should allow spectating a match', async ({ page }) => {
      // Navigate to spectator view
      const matchId = 'test-match-id';
      await page.goto(`http://localhost:3000/spectate/${matchId}`);
      
      // Should show board but no dice/controls
      await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
      await expect(page.locator('[data-testid="dice"]')).not.toBeVisible();
    });
  });
});

// Helper function to create test match via API
async function createTestMatch(page: any, options: { mode?: string; entryFee?: number; opponentCount?: number; botDifficulty?: string } = {}) {
  const response = await page.request.post('http://localhost:3001/api/v1/game/matches', {
    data: {
      mode: options.mode || 'vs_human',
      entryFee: options.entryFee || 100,
      opponentCount: options.opponentCount || 1,
      botDifficulty: options.botDifficulty || 'medium',
    },
    headers: {
      'Authorization': `Bearer ${process.env.TEST_USER_TOKEN || 'mock-token'}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to create match: ${response.statusText()}`);
  }
  
  return response.json();
}