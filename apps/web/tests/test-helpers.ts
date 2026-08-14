// ============================================
// Playwright Test Helpers & Fixtures
// ============================================

import { test as base, Page, expect, APIRequestContext } from '@playwright/test';

// Extend test with custom fixtures
type TestFixtures = {
  authenticatedPage: Page;
  apiContext: APIRequestContext;
  testUsers: { user1: any; user2: any; user3: any; user4: any };
};

export const test = base.extend<TestFixtures>({
  // Authenticated page fixture - creates a logged-in user
  authenticatedPage: async ({ page }, use) => {
    // In a real setup, this would log in via API
    // For now, we'll set a mock token
    await page.addInitScript(() => {
      localStorage.setItem('access_token', 'mock-test-token');
      localStorage.setItem('user_id', 'test-user-1');
      localStorage.setItem('username', 'TestPlayer1');
    });
    
    await use(page);
  },

  // API context for making requests
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: 'http://localhost:3001',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    
    await use(context);
    await context.dispose();
  },

  // Test users for multi-player scenarios
  testUsers: async ({ apiContext }, use) => {
    // Create or get test users
    // In a real setup, you'd create users via API
    const users = {
      user1: { id: 'test-user-1', username: 'TestPlayer1', token: 'mock-token-1' },
      user2: { id: 'test-user-2', username: 'TestPlayer2', token: 'mock-token-2' },
      user3: { id: 'test-user-3', username: 'TestPlayer3', token: 'mock-token-3' },
      user4: { id: 'test-user-4', username: 'TestPlayer4', token: 'mock-token-4' },
    };
    
    await use(users);
  },
});

// Helper functions
export async function createMatch(apiContext: APIRequestContext, options: any = {}) {
  const response = await apiContext.post('/api/v1/game/matches', {
    data: {
      mode: options.mode || 'vs_human',
      entryFee: options.entryFee || 100,
      opponentCount: options.opponentCount || 1,
      botDifficulty: options.botDifficulty || 'medium',
    },
    headers: {
      'Authorization': `Bearer ${options.token || 'mock-token'}`,
    },
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to create match: ${await response.text()}`);
  }
  
  return response.json();
}

export async function joinMatch(apiContext: any, matchId: string, token: string) {
  const response = await apiContext.post(`/api/v1/game/matches/${matchId}/join`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to join match: ${await response.text()}`);
  }
  
  return response.json();
}

export async function rollDice(apiContext: any, matchId: string, token: string) {
  const response = await apiContext.post(`/api/v1/game/matches/${matchId}/roll`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to roll dice: ${await response.text()}`);
  }
  
  return response.json();
}

export async function moveToken(apiContext: any, matchId: string, tokenId: number, toPosition: number, token: string) {
  const response = await apiContext.post(`/api/v1/game/matches/${matchId}/move`, {
    data: { tokenId, toPosition },
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to move token: ${await response.text()}`);
  }
  
  return response.json();
}

export async function getMatchState(apiContext: any, matchId: string, token: string) {
  const response = await apiContext.get(`/api/v1/game/matches/${matchId}/state`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to get match state: ${await response.text()}`);
  }
  
  return response.json();
}

// WebSocket test helpers
export class WebSocketTestHelper {
  private ws: WebSocket | null = null;
  private messages: any[] = [];
  private onMessageCallback: ((data: any) => void) | null = null;

  async connect(url: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`${url}/game?token=${token}`);
      
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messages.push(data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      };
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(event: string, data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    }
  }

  onMessage(callback: (data: any) => void): void {
    this.onMessageCallback = callback;
  }

  waitForEvent(eventName: string, timeout = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timeout waiting for ${eventName}`)), timeout);
      
      const handler = (data: any) => {
        if (data.event === eventName || (data.type === eventName)) {
          clearTimeout(timer);
          this.onMessageCallback = null;
          resolve(data);
        }
      };
      
      this.onMessage(handler);
      
      // Also check existing messages
      for (const msg of this.messages) {
        if (msg.event === eventName || msg.type === eventName) {
          clearTimeout(timer);
          this.onMessageCallback = null;
          resolve(msg);
          return;
        }
      }
    });
  }

  getMessages(): any[] {
    return [...this.messages];
  }
}

export async function waitForGameState(page: Page, testId: string, timeout = 10000) {
  await page.waitForSelector(`[data-testid="${testId}"]`, { timeout });
}

export async function waitForConnectionStatus(page: Page, status: 'Connected' | 'Reconnecting...' | 'Syncing...' | 'Disconnected', timeout = 10000) {
  await page.waitForFunction(
    (expectedStatus) => {
      const element = document.querySelector('[data-testid="connection-status"]');
      return element?.textContent?.includes(expectedStatus);
    },
    status,
    { timeout }
  );
}

// Test data factories
export const testFactories = {
  createUser: (overrides = {}) => ({
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    username: `TestUser${Math.random().toString(36).substr(2, 6)}`,
    email: `test${Date.now()}@example.com`,
    fullName: 'Test User',
    country: 'US',
    mobileNumber: '+15551234567',
    dateOfBirth: '2000-01-01',
    password: 'Test123!',
    ...overrides,
  }),

  createMatch: (overrides = {}) => ({
    mode: 'vs_human',
    entryFee: 100,
    opponentCount: 1,
    botDifficulty: 'medium',
    rules: {},
    ...overrides,
  }),

  createRoom: (overrides = {}) => ({
    name: `Test Room ${Date.now()}`,
    maxPlayers: 4,
    entryFee: 100,
    isPrivate: true,
    ...overrides,
  }),
};

// Assertion helpers
export async function expectGameBoardVisible(page: Page) {
  await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
}

export async function expectDiceVisible(page: Page) {
  await expect(page.locator('[data-testid="dice"]')).toBeVisible();
}

export async function expectLegalMovesHighlighted(page: Page) {
  await expect(page.locator('[data-testid="legal-move-highlight"]').first()).toBeVisible();
}

export async function expectConnectionStatus(page: Page, status: string) {
  await expect(page.locator('[data-testid="connection-status"]')).toContainText(status);
}

export async function expectChatVisible(page: Page) {
  await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible();
}

export async function expectGameOver(page: Page) {
  await expect(page.locator('[data-testid="game-over-overlay"]')).toBeVisible();
}

// Test configuration
export const TEST_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  API_URL: 'http://localhost:3001',
  WS_URL: 'ws://localhost:3001',
  DEFAULT_TIMEOUT: 30000,
  WS_TIMEOUT: 10000,
};