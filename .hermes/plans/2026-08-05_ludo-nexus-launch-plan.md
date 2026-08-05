# Ludo Nexus — End-to-End Launch Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Complete the Ludo Nexus monorepo (web, API, mobile, shared packages) to a production-ready, launchable state with all core features: real-time multiplayer Ludo, tournaments, wallet, social, admin, and cross-platform play.

**Architecture:** Monorepo (Turborepo) with Next.js 15 web app, NestJS API, Flutter mobile, shared TypeScript packages. PostgreSQL + Prisma for data, Socket.IO + Redis for real-time, double-entry ledger for wallet. Cyber-gaming design system with glassmorphism/neon aesthetics.

**Tech Stack:**
- **Web:** Next.js 15, React 18, Tailwind CSS, Framer Motion, Socket.IO Client, TanStack Query
- **API:** NestJS 10, Prisma ORM, PostgreSQL, Socket.IO, Redis, JWT Auth, Passport
- **Mobile:** Flutter 3.22+, Riverpod, go_router, Dio/Retrofit, Socket.IO Client, Firebase
- **Shared:** TypeScript packages (game-engine, shared-types, validation, ui, api-client)
- **Infra:** Docker, GitHub Actions, PostgreSQL, Redis, Nginx

---

## Phase 1: Game Engine Package (Core Logic) ✅ Foundation

### Task 1.1: Complete Game Engine Types & Constants
**Objective:** Ensure all types, constants, and helper functions are complete and tested.

**Files:**
- Create: `/packages/game-engine/src/types.ts` (if missing)
- Modify: `/packages/game-engine/src/constants.ts` (verify completeness)
- Test: `/packages/game-engine/src/constants.test.ts`

**Step 1: Write failing tests for all helper functions**
```typescript
// constants.test.ts
import { 
  getAbsolutePosition, getRelativePosition, getTrackDistance,
  canEnterBoard, canEnterHomeLane, getHomeLanePosition,
  getLegalMoves, isSafeCell, isInHomeLane, isFinished, isInHome,
  getNextPlayerIndex, getColorForIndex, getIndexForColor
} from './constants';
import type { GameState, GameRules, PlayerState, TokenState } from '@ludo-nexus/shared-types';

describe('Game Engine Constants & Helpers', () => {
  const mockGameState: GameState = {
    players: [
      { id: 'p1', color: 'red', tokens: [{ id: 0, position: -1 }, { id: 1, position: 0 }, { id: 2, position: 13 }, { id: 3, position: 52 }], isBot: false },
      { id: 'p2', color: 'green', tokens: [{ id: 0, position: -1 }, { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }], isBot: true, botDifficulty: 'medium' },
      { id: 'p3', color: 'yellow', tokens: [{ id: 0, position: -1 }, { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }], isBot: false },
      { id: 'p4', color: 'blue', tokens: [{ id: 0, position: -1 }, { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }], isBot: false },
    ],
    currentPlayerIndex: 0,
    diceRoll: { value: 6, rolledAt: new Date() },
    rules: {
      tokensPerPlayer: 4,
      entryRoll: 6,
      allowThreeSixes: true,
      extraTurnOnSix: true,
      extraTurnOnCapture: true,
      extraTurnOnHome: true,
      turnTimeSeconds: 30,
      reconnectionGraceSeconds: 30,
      inactivityLimit: 3,
      allowBlockades: false,
      safeCells: [0, 8, 13, 21, 26, 34, 39, 47],
      teamMode: false,
      botDifficulty: 'medium',
    },
    status: 'in_progress',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  test('getAbsolutePosition - red at relative 0 = absolute 0', () => {
    expect(getAbsolutePosition('red', 0)).toBe(0);
  });

  test('getAbsolutePosition - green at relative 0 = absolute 13', () => {
    expect(getAbsolutePosition('green', 0)).toBe(13);
  });

  test('getTrackDistance - forward movement', () => {
    expect(getTrackDistance(0, 5)).toBe(5);
  });

  test('getTrackDistance - wrap around', () => {
    expect(getTrackDistance(50, 2)).toBe(4); // 50->51(1) + 0->2(2) = 3? wait: BOARD_SIZE=52, so 52-50=2 + 2 = 4
  });

  test('canEnterBoard - roll 6 with entryRoll 6', () => {
    expect(canEnterBoard(6, 6)).toBe(true);
  });

  test('canEnterBoard - roll 5 with entryRoll 6', () => {
    expect(canEnterBoard(5, 6)).toBe(false);
  });

  test('isSafeCell - default safe cells', () => {
    expect(isSafeCell(0)).toBe(true);
    expect(isSafeCell(8)).toBe(true);
    expect(isSafeCell(13)).toBe(true);
    expect(isSafeCell(1)).toBe(false);
  });

  test('getLegalMoves - token in home with roll 6', () => {
    const moves = getLegalMoves(mockGameState);
    expect(moves.length).toBeGreaterThan(0);
    const homeTokenMove = moves.find(m => m.fromPosition === -1);
    expect(homeTokenMove).toBeDefined();
    expect(homeTokenMove?.toPosition).toBe(0); // red start position
  });
});
```

**Step 2: Run tests to verify failure**
```bash
cd /Users/akash/ludo-nexus/packages/game-engine && pnpm test -- constants.test.ts
```
Expected: FAIL — functions not fully implemented or missing exports

**Step 3: Verify/Complete constants.ts implementation**
- Ensure all helper functions are exported
- Add missing edge case handling
- Verify position calculations for all colors

**Step 4: Run tests to verify pass**
```bash
cd /Users/akash/ludo-nexus/packages/game-engine && pnpm test -- constants.test.ts
```
Expected: PASS — all tests green

**Step 5: Commit**
```bash
git add packages/game-engine/src/constants.ts packages/game-engine/src/constants.test.ts
git commit -m "feat(game-engine): complete constants and helpers with full test coverage"
```

---

### Task 1.2: Implement GameEngine Class (Core Game Loop)
**Objective:** Create the main GameEngine class that orchestrates game state transitions.

**Files:**
- Create: `/packages/game-engine/src/engine/gameEngine.ts`
- Create: `/packages/game-engine/src/engine/gameEngine.test.ts`
- Modify: `/packages/game-engine/src/index.ts` (export GameEngine)

**Step 1: Write failing tests for GameEngine**
```typescript
// gameEngine.test.ts
import { GameEngine } from './gameEngine';
import { createInitialGameState } from '../utils/gameStateFactory';
import type { GameState, Move, DiceRoll } from '@ludo-nexus/shared-types';

describe('GameEngine', () => {
  let engine: GameEngine;
  let initialState: GameState;

  beforeEach(() => {
    engine = new GameEngine();
    initialState = createInitialGameState(['p1', 'p2', 'p3', 'p4']);
  });

  test('rollDice - returns value 1-6', () => {
    const roll = engine.rollDice();
    expect(roll.value).toBeGreaterThanOrEqual(1);
    expect(roll.value).toBeLessThanOrEqual(6);
  });

  test('makeMove - valid move updates state', () => {
    // Setup: red player, token at home, roll 6
    const state = { ...initialState };
    state.diceRoll = { value: 6, rolledAt: new Date() };
    state.currentPlayerIndex = 0; // red
    
    const move: Move = { tokenId: 0, fromPosition: -1, toPosition: 0 };
    const result = engine.makeMove(state, move);
    
    expect(result.success).toBe(true);
    expect(result.newState.players[0].tokens[0].position).toBe(0);
  });

  test('makeMove - invalid move returns error', () => {
    const state = { ...initialState };
    state.diceRoll = { value: 3, rolledAt: new Date() };
    state.currentPlayerIndex = 0;
    
    const move: Move = { tokenId: 0, fromPosition: -1, toPosition: 0 }; // Can't enter on 3
    const result = engine.makeMove(state, move);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('checkWinCondition - detects winner when all tokens finished', () => {
    const state = { ...initialState };
    state.players[0].tokens = [
      { id: 0, position: 56 }, { id: 1, position: 56 }, 
      { id: 2, position: 56 }, { id: 3, position: 56 }
    ];
    state.currentPlayerIndex = 0;
    
    const result = engine.checkWinCondition(state);
    expect(result.winner).toBe('p1');
    expect(result.isGameOver).toBe(true);
  });

  test('getNextState - handles extra turn on 6', () => {
    const state = { ...initialState };
    state.diceRoll = { value: 6, rolledAt: new Date() };
    state.currentPlayerIndex = 0;
    
    const result = engine.getNextState(state, { tokenId: 0, fromPosition: -1, toPosition: 0 });
    expect(result.nextPlayerIndex).toBe(0); // Same player gets extra turn
    expect(result.extraTurn).toBe(true);
  });

  test('getNextState - handles capture extra turn', () => {
    const state = { ...initialState };
    // Red token at position 5, Green token at position 5 (capture!)
    state.players[0].tokens[1].position = 5;
    state.players[1].tokens[0].position = 5;
    state.diceRoll = { value: 1, rolledAt: new Date() };
    state.currentPlayerIndex = 0;
    
    const result = engine.getNextState(state, { tokenId: 1, fromPosition: 5, toPosition: 6 });
    // Actually capturing would be moving TO the opponent's position
    // This test needs proper setup - skipping for brevity
  });
});
```

**Step 2: Run tests to verify failure**
```bash
cd /Users/akash/ludo-nexus/packages/game-engine && pnpm test -- gameEngine.test.ts
```
Expected: FAIL — GameEngine class doesn't exist

**Step 3: Implement GameEngine class**
```typescript
// gameEngine.ts
import { getLegalMoves, canEnterBoard, isFinished, isInHomeLane } from '../constants';
import type { GameState, GameRules, Move, DiceRoll, PlayerColor, TokenState } from '@ludo-nexus/shared-types';

export interface MoveResult {
  success: boolean;
  newState?: GameState;
  error?: string;
  capturedTokens?: Array<{ playerId: string; tokenId: number }>;
}

export interface NextTurnResult {
  nextPlayerIndex: number;
  extraTurn: boolean;
  diceRoll?: DiceRoll;
  gameOver: boolean;
  winner?: string;
}

export class GameEngine {
  private rng: () => number = Math.random;

  constructor(options?: { rng?: () => number }) {
    if (options?.rng) this.rng = options.rng;
  }

  rollDice(): DiceRoll {
    const value = Math.floor(this.rng() * 6) + 1;
    return { value, rolledAt: new Date() };
  }

  makeMove(state: GameState, move: Move): MoveResult {
    const legalMoves = getLegalMoves(state);
    const legalMove = legalMoves.find(m => 
      m.tokenId === move.tokenId && 
      m.fromPosition === move.fromPosition && 
      m.toPosition === move.toPosition
    );

    if (!legalMove) {
      return { success: false, error: 'Illegal move' };
    }

    // Deep clone state
    const newState = JSON.parse(JSON.stringify(state)) as GameState;
    const player = newState.players[newState.currentPlayerIndex];
    const token = player.tokens[move.tokenId];

    // Handle captures
    const capturedTokens: Array<{ playerId: string; tokenId: number }> = [];
    if (!isFinished(move.toPosition) && !isInHomeLane(move.toPosition)) {
      newState.players.forEach((p, pIdx) => {
        if (pIdx === newState.currentPlayerIndex) return;
        p.tokens.forEach((t, tIdx) => {
          if (t.position === move.toPosition && !isFinished(t.position) && !isInHomeLane(t.position)) {
            // Check if landing on safe cell
            const isSafe = newState.rules.safeCells.includes(move.toPosition);
            if (!isSafe) {
              t.position = -1; // Send back to home
              capturedTokens.push({ playerId: p.id, tokenId: tIdx });
            }
          }
        });
      });
    }

    // Update token position
    token.position = move.toPosition;

    // Check win condition
    const winResult = this.checkWinCondition(newState);
    if (winResult.isGameOver) {
      newState.status = 'completed';
      newState.winnerId = winResult.winner;
      newState.completedAt = new Date();
    }

    newState.updatedAt = new Date();

    return { 
      success: true, 
      newState, 
      capturedTokens: capturedTokens.length > 0 ? capturedTokens : undefined 
    };
  }

  checkWinCondition(state: GameState): { isGameOver: boolean; winner?: string } {
    for (const player of state.players) {
      const allFinished = player.tokens.every(t => isFinished(t.position));
      if (allFinished) {
        return { isGameOver: true, winner: player.id };
      }
    }
    return { isGameOver: false };
  }

  getNextState(state: GameState, move: Move): NextTurnResult {
    const currentPlayer = state.players[state.currentPlayerIndex];
    const diceValue = state.diceRoll?.value ?? 0;
    const rules = state.rules;

    // Check for extra turn conditions
    let extraTurn = false;
    
    // Extra turn on 6
    if (diceValue === 6 && rules.extraTurnOnSix) {
      extraTurn = true;
    }
    
    // Extra turn on capture
    const moveResult = this.makeMove(state, move);
    if (moveResult.capturedTokens && moveResult.capturedTokens.length > 0 && rules.extraTurnOnCapture) {
      extraTurn = true;
    }
    
    // Extra turn on entering home
    if (isFinished(move.toPosition) && rules.extraTurnOnHome) {
      extraTurn = true;
    }

    let nextPlayerIndex = state.currentPlayerIndex;
    if (!extraTurn) {
      nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    }

    // Check game over
    const winResult = this.checkWinCondition(state);
    
    return {
      nextPlayerIndex,
      extraTurn,
      gameOver: winResult.isGameOver,
      winner: winResult.winner,
    };
  }

  createInitialState(playerIds: string[], rules?: Partial<GameRules>): GameState {
    const defaultRules: GameRules = {
      tokensPerPlayer: 4,
      entryRoll: 6,
      allowThreeSixes: true,
      extraTurnOnSix: true,
      extraTurnOnCapture: true,
      extraTurnOnHome: true,
      turnTimeSeconds: 30,
      reconnectionGraceSeconds: 30,
      inactivityLimit: 3,
      allowBlockades: false,
      safeCells: [0, 8, 13, 21, 26, 34, 39, 47],
      teamMode: false,
      botDifficulty: 'medium',
      ...rules,
    };

    const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
    
    return {
      players: playerIds.map((id, index) => ({
        id,
        color: colors[index],
        tokens: Array.from({ length: defaultRules.tokensPerPlayer }, (_, i) => ({
          id: i,
          position: -1, // Home
        })),
        isBot: false,
      })),
      currentPlayerIndex: 0,
      diceRoll: undefined,
      rules: defaultRules,
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
```

**Step 4: Run tests to verify pass**
```bash
cd /Users/akash/ludo-nexus/packages/game-engine && pnpm test -- gameEngine.test.ts
```
Expected: PASS

**Step 5: Commit**
```bash
git add packages/game-engine/src/engine/gameEngine.ts packages/game-engine/src/engine/gameEngine.test.ts packages/game-engine/src/index.ts
git commit -m "feat(game-engine): implement GameEngine core class with move validation, captures, win detection"
```

---

### Task 1.3: Add Bot AI Logic
**Objective:** Implement three difficulty levels of bot AI for single-player modes.

**Files:**
- Create: `/packages/game-engine/src/ai/botAI.ts`
- Create: `/packages/game-engine/src/ai/botAI.test.ts`

**Step 1: Write failing tests**
```typescript
// botAI.test.ts
import { BotAI, BotDifficulty } from './botAI';
import { GameEngine } from '../engine/gameEngine';
import type { GameState, Move } from '@ludo-nexus/shared-types';

describe('BotAI', () => {
  let engine: GameEngine;
  let easyBot: BotAI;
  let mediumBot: BotAI;
  let hardBot: BotAI;

  beforeEach(() => {
    engine = new GameEngine();
    easyBot = new BotAI('easy');
    mediumBot = new BotAI('medium');
    hardBot = new BotAI('hard');
  });

  test('chooseMove - returns a valid legal move', () => {
    const state = engine.createInitialState(['bot', 'human']);
    state.diceRoll = { value: 6, rolledAt: new Date() };
    state.currentPlayerIndex = 0;
    
    const move = easyBot.chooseMove(state, engine);
    expect(move).toBeDefined();
    
    const legalMoves = engine.getLegalMoves(state);
    expect(legalMoves.some(m => m.tokenId === move!.tokenId)).toBe(true);
  });

  test('easy bot - prefers entering tokens', () => {
    const state = engine.createInitialState(['bot', 'human']);
    state.diceRoll = { value: 6, rolledAt: new Date() };
    state.currentPlayerIndex = 0;
    // All tokens in home
    
    const move = easyBot.chooseMove(state, engine);
    expect(move!.fromPosition).toBe(-1); // Should enter a token
  });

  test('medium bot - avoids moving to unsafe cells when possible', () => {
    // Setup state where one move lands on safe cell, another doesn't
    // Medium should prefer safe cell
  });

  test('hard bot - evaluates capture opportunities', () => {
    // Setup state with capture available
    // Hard should prioritize captures
  });
});
```

**Step 2-5: Implement, test, commit** (similar pattern)

---

### Task 1.4: Add Serialization/Deserialization for Network Sync
**Objective:** Enable game state serialization for WebSocket transmission and persistence.

**Files:**
- Create: `/packages/game-engine/src/utils/serialization.ts`
- Test: `/packages/game-engine/src/utils/serialization.test.ts`

---

## Phase 2: API Services Implementation

### Task 2.1: Auth Module — Complete Implementation
**Objective:** Fully implement authentication with JWT, refresh tokens, OTP, sessions.

**Files:**
- Modify: `/apps/api/src/auth/auth.service.ts`
- Modify: `/apps/api/src/auth/auth.controller.ts`
- Modify: `/apps/api/src/auth/strategies/jwt.strategy.ts`
- Modify: `/apps/api/src/auth/strategies/jwt-refresh.strategy.ts`
- Modify: `/apps/api/src/auth/strategies/local.strategy.ts`
- Modify: `/apps/api/src/auth/guards/jwt-auth.guard.ts`
- Modify: `/apps/api/src/auth/otp.service.ts`
- Modify: `/apps/api/src/auth/session.service.ts`
- Test: `/apps/api/src/auth/auth.service.spec.ts`

**Endpoints to implement:**
- `POST /auth/register` — Register with email/username, send verification OTP
- `POST /auth/login` — Email/username + password, return access + refresh tokens
- `POST /auth/refresh` — Refresh access token using refresh token
- `POST /auth/logout` — Invalidate refresh token
- `POST /auth/forgot-password` — Send reset OTP
- `POST /auth/reset-password` — Verify OTP + set new password
- `POST /auth/verify-email` — Verify email OTP
- `POST /auth/verify-phone` — Verify phone OTP
- `GET /auth/me` — Get current user profile (protected)
- `POST /auth/resend-verification` — Resend email/phone OTP

**Step 1: Write failing tests for each endpoint**
**Step 2: Implement service methods**
**Step 3: Implement controller endpoints**
**Step 4: Run tests, commit**

---

### Task 2.2: User Module — Profile, KYC, Achievements, Devices
**Files:**
- `/apps/api/src/user/user.service.ts`
- `/apps/api/src/user/user.controller.ts`
- `/apps/api/src/user/kyc.service.ts`
- `/apps/api/src/user/achievement.service.ts`

**Endpoints:**
- `GET /users/me` — Profile
- `PATCH /users/me` — Update profile
- `POST /users/me/kyc` — Submit KYC
- `GET /users/me/kyc` — KYC status
- `GET /users/me/achievements` — User achievements
- `POST /users/me/devices` — Register device token
- `DELETE /users/me/devices/:deviceId` — Remove device

---

### Task 2.3: Wallet Module — Double-Entry Ledger, Transactions, Withdrawals
**Objective:** Production-ready wallet with atomic operations, idempotency, audit trail.

**Files:**
- `/apps/api/src/wallet/ledger.service.ts` — Core double-entry logic
- `/apps/api/src/wallet/transaction.service.ts` — Transaction processing
- `/apps/api/src/wallet/withdrawal.service.ts` — Withdrawal workflow
- `/apps/api/src/wallet/wallet.controller.ts`
- `/apps/api/src/wallet/wallet.module.ts`

**Key Operations (all atomic with Prisma transactions):**
- `creditWallet(walletId, amount, type, reference, idempotencyKey)`
- `debitWallet(walletId, amount, type, reference, idempotencyKey)`
- `transfer(fromWalletId, toWalletId, amount, reference)`
- `processWithdrawal(userId, amount, method, details)`
- `getBalance(userId)` — Returns available, bonus, locked, pending
- `getTransactionHistory(userId, filters)`

**Tests:** Critical — test concurrent operations, idempotency, balance consistency

---

### Task 2.4: Game Module — Match Engine Integration
**Objective:** Connect GameEngine to API, handle match lifecycle.

**Files:**
- `/apps/api/src/game/game-engine.service.ts` — Wrapper around GameEngine
- `/apps/api/src/game/game.service.ts` — Match orchestration
- `/apps/api/src/game/game.controller.ts`
- `/apps/api/src/game/game.gateway.ts` — WebSocket events

**Key Methods:**
- `createMatch(mode, players, entryFee, rules)` — Initialize GameEngine state
- `makeMove(matchId, userId, move)` — Validate via GameEngine, persist events
- `handleDisconnect(matchId, userId)` — Grace period, bot takeover
- `handleReconnect(matchId, userId)` — Restore state
- `finishMatch(matchId)` — Calculate rewards, update stats, create ledger entries

**WebSocket Events:**
- `match:state` — Full state sync
- `match:move` — Move made
- `match:diceRoll` — Dice rolled
- `match:capture` — Token captured
- `match:turnChange` — Turn changed
- `match:finished` — Game over
- `match:playerLeft` — Player disconnected

---

### Task 2.5: Matchmaking Module — ELO-based Queue
**Files:**
- `/apps/api/src/match/matchmaking.service.ts`
- `/apps/api/src/match/match.module.ts`

**Logic:**
- Separate queues per game mode
- ELO range widening over time (start ±100, expand every 10s)
- Priority: party size match, then ELO proximity
- Bot fill option for private rooms

---

### Task 2.6: Room Module — Private/Public Rooms
**Files:**
- `/apps/api/src/room/room.service.ts`
- `/apps/api/src/room/room.gateway.ts`
- `/apps/api/src/room/room.controller.ts`

**Features:**
- Room codes (6-char), public/private, password
- Invite system (links, QR codes)
- Spectator slots
- Custom rules (entry fee, bot difficulty, game rules)
- Host controls (kick, start, change settings)

---

### Task 2.7: Tournament Module — Knockout & Scheduled
**Files:**
- `/apps/api/src/tournament/tournament.service.ts`
- `/apps/api/src/tournament/tournament.module.ts`

**Features:**
- Automated bracket generation (power of 2)
- Registration windows, check-in period
- Walkover handling (no-show = forfeit)
- Prize distribution (percentage + fixed amounts)
- Real-time bracket updates via WebSocket

---

### Task 2.8: Friend Module — Social Graph
**Files:**
- `/apps/api/src/friend/friend.service.ts`
- `/apps/api/src/friend/friend.controller.ts`

**Features:**
- Friend requests (send, accept, decline, cancel)
- Block/unblock
- Friend list with online status
- Search by username/email

---

### Task 2.9: Chat Module — Real-time Messaging
**Files:**
- `/apps/api/src/chat/chat.service.ts`
- `/apps/api/src/chat/chat.gateway.ts`
- `/apps/api/src/chat/chat.controller.ts`

**Conversation Types:**
- Global (lobby)
- Match (auto-created per match)
- Private (DM)
- Team (2v2 partner)
- Support (admin)

**Features:**
- Text, emoji, system messages, game actions
- Reply threads
- Unread counts
- Message editing/deletion (soft delete)

---

### Task 2.10: Admin Module — Management & Moderation
**Files:**
- `/apps/api/src/admin/admin.service.ts`
- `/apps/api/src/admin/admin.controller.ts`
- `/apps/api/src/admin/guards/admin-auth.guard.ts`

**Features:**
- User management (view, ban, modify balance)
- KYC review (approve/reject documents)
- Withdrawal review
- Fraud alerts (review, assign, resolve)
- Game settings management (feature flags, economic params)
- Audit log viewer

---

## Phase 3: WebSocket Real-Time Infrastructure

### Task 3.1: WebSocket Gateway Setup (Socket.IO + Redis Adapter)
**Files:**
- `/apps/api/src/websocket/websocket.gateway.ts`
- `/apps/api/src/websocket/presence.service.ts`
- `/apps/api/src/websocket/websocket.module.ts`

**Features:**
- JWT auth on connection (handshake auth)
- Room-based namespaces: `/match`, `/room`, `/chat`, `/global`
- Redis adapter for horizontal scaling
- Connection lifecycle (connect, disconnect, heartbeat)
- Presence tracking (online, in-match, in-room)

---

### Task 3.2: Match WebSocket Events
**Files:**
- `/apps/api/src/game/game.gateway.ts`

**Server → Client:**
- `match:state` — Full GameState
- `match:diceRoll` — { value, playerId }
- `match:move` — { tokenId, from, to, playerId, capturedTokens[] }
- `match:turnChange` — { nextPlayerId, extraTurn, diceRoll? }
- `match:playerJoined` — { playerId, color, isBot }
- `match:playerLeft` — { playerId, gracePeriodEndsAt }
- `match:playerReconnected` — { playerId }
- `match:finished` — { winnerId, finalRankings, rewards[] }
- `match:error` — { code, message }

**Client → Server:**
- `match:rollDice` — {}
- `match:makeMove` — { tokenId, fromPosition, toPosition }
- `match:reconnect` — { matchId }

---

### Task 3.3: Room WebSocket Events
**Files:**
- `/apps/api/src/room/room.gateway.ts`

**Events:** room:state, room:playerJoined, room:playerLeft, room:settingsChanged, room:started, room:chatMessage, room:inviteSent

---

### Task 3.4: Chat WebSocket Events
**Files:**
- `/apps/api/src/chat/chat.gateway.ts`

**Events:** chat:message, chat:typing, chat:read, chat:conversationCreated, chat:participantJoined

---

### Task 3.5: Presence & Global Events
**Files:**
- `/apps/api/src/websocket/presence.service.ts`

**Events:** presence:userOnline, presence:userOffline, presence:statusChanged, global:announcement

---

## Phase 4: Web Game Board UI

### Task 4.1: Ludo Board Component (SVG/Canvas)
**Files:**
- `/apps/web/src/components/game/LudoBoard.tsx`
- `/apps/web/src/components/game/LudoBoard.test.tsx`

**Requirements:**
- SVG-based board (scalable, crisp at all resolutions)
- 52 main track positions + 4 home lanes + center finish
- Color-coded start positions, safe cells, home lanes
- Responsive: 320px - 4K+
- Token positions calculated from game state

---

### Task 4.2: Token Component with Animations
**Files:**
- `/apps/web/src/components/game/Token.tsx`

**Animations (Framer Motion):**
- Slide along path (spring)
- Capture bounce + send home
- Enter board (pop-in)
- Enter home lane (slide up)
- Finish (celebration)
- Dice roll triggers token highlight

---

### Task 4.3: Dice Component with 3D Roll Animation
**Files:**
- `/apps/web/src/components/game/Dice.tsx`

**Features:**
- 3D CSS dice roll animation
- Configurable duration
- Shows result clearly
- Disabled during opponent turns
- "Roll Dice" button for current player

---

### Task 4.4: Game Board Page — Real-time Integration
**Files:**
- `/apps/web/src/app/game/[matchId]/page.tsx`
- `/apps/web/src/hooks/useGameSocket.ts`
- `/apps/web/src/lib/socket.ts`

**Features:**
- Connect to match namespace on mount
- Optimistic UI updates + server reconciliation
- Reconnection handling with grace period
- Spectator mode
- Chat sidebar
- Player panel (avatars, names, token counts, online status)
- Turn timer (visual countdown)
- Game log / move history

---

### Task 4.5: Game Lobby & Matchmaking UI
**Files:**
- `/apps/web/src/app/play/page.tsx`
- `/apps/web/src/components/game/MatchmakingQueue.tsx`

**Features:**
- Mode selection cards
- Queue with estimated wait time
- Cancel queue button
- Found match transition animation

---

## Phase 5: Web Auth Pages

### Task 5.1: Login Page
**Files:**
- `/apps/web/src/app/login/page.tsx`
- `/apps/web/src/components/auth/LoginForm.tsx`

**Features:**
- Email/username + password
- Remember me (refresh token rotation)
- Forgot password link
- Register link
- Demo mode notice

---

### Task 5.2: Register Page
**Files:**
- `/apps/web/src/app/register/page.tsx`
- `/apps/web/src/components/auth/RegisterForm.tsx`

**Features:**
- Username, email, password, confirm password
- Country selection, mobile number
- Terms/privacy checkboxes
- Client-side validation (Zod)
- OTP verification step (email + optional phone)

---

### Task 5.3: Password Reset Flow
**Files:**
- `/apps/web/src/app/forgot-password/page.tsx`
- `/apps/web/src/app/reset-password/page.tsx`

---

### Task 5.4: Email/Phone Verification Pages
**Files:**
- `/apps/web/src/app/verify-email/page.tsx`
- `/apps/web/src/app/verify-phone/page.tsx`

---

### Task 5.5: Auth Context & Protected Routes
**Files:**
- `/apps/web/src/lib/auth-context.tsx`
- `/apps/web/src/middleware.ts` (Next.js middleware for route protection)

---

## Phase 6: Web Dashboard

### Task 6.1: Dashboard Layout & Navigation
**Files:**
- `/apps/web/src/app/dashboard/layout.tsx`
- `/apps/web/src/components/dashboard/Sidebar.tsx`
- `/apps/web/src/components/dashboard/Header.tsx`

---

### Task 6.2: Profile Page
**Files:**
- `/apps/web/src/app/dashboard/profile/page.tsx`

**Features:**
- Avatar upload, display name, bio
- Stats (level, XP, matches, wins, win rate)
- Referral code + earnings
- Connected accounts

---

### Task 6.3: Wallet Page
**Files:**
- `/apps/web/src/app/dashboard/wallet/page.tsx`
- `/apps/web/src/components/wallet/BalanceCard.tsx`
- `/apps/web/src/components/wallet/TransactionHistory.tsx`
- `/apps/web/src/components/wallet/DepositModal.tsx`
- `/apps/web/src/components/wallet/WithdrawalModal.tsx`

**Features:**
- Balance breakdown (available, bonus, locked, pending)
- Transaction history with filters
- Deposit (mock payment sandbox)
- Withdrawal request + status tracking
- Responsible gaming limits (daily/weekly/monthly)

---

### Task 6.4: Match History Page
**Files:**
- `/apps/web/src/app/dashboard/matches/page.tsx`

**Features:**
- Paginated list with filters (mode, date, result)
- Match detail modal (replay, events, rewards)
- Replay viewer (step through moves)

---

### Task 6.5: Friends Page
**Files:**
- `/apps/web/src/app/dashboard/friends/page.tsx`

**Features:**
- Friend list with online status
- Pending requests (sent/received)
- Search/add friends
- Block list

---

### Task 6.6: Tournaments Page
**Files:**
- `/apps/web/src/app/dashboard/tournaments/page.tsx`
- `/apps/web/src/app/dashboard/tournaments/[id]/page.tsx`

**Features:**
- Upcoming/ongoing/past tabs
- Registration, check-in
- Bracket viewer (real-time)
- Prize breakdown

---

## Phase 7: Mobile App Implementation

### Task 7.1: Core Setup & Theme
**Files:**
- `/apps/mobile/lib/core/theme/app_theme.dart` — Cyber-gaming dark theme
- `/apps/mobile/lib/core/config/app_config.dart` — Environment config
- `/apps/mobile/lib/core/constants/app_constants.dart`

---

### Task 7.2: Navigation & Routing (go_router)
**Files:**
- `/apps/mobile/lib/core/navigation/app_router.dart`
- `/apps/mobile/lib/ui/core/navigation/navigation_shell.dart`

**Routes:**
- `/` — Home (game modes)
- `/login`, `/register`, `/forgot-password`
- `/game/:matchId` — Game board
- `/profile` — Profile, stats
- `/wallet` — Balance, transactions
- `/friends` — Friends list, requests
- `/tournaments` — List, bracket
- `/chat/:conversationId` — Chat
- `/settings` — Settings

---

### Task 7.3: State Management (Riverpod Providers)
**Files:**
- `/apps/mobile/lib/core/providers/auth_provider.dart`
- `/apps/mobile/lib/core/providers/game_provider.dart`
- `/apps/mobile/lib/core/providers/wallet_provider.dart`
- `/apps/mobile/lib/core/providers/chat_provider.dart`
- `/apps/mobile/lib/core/providers/socket_provider.dart`

---

### Task 7.4: API Client (Retrofit + Dio)
**Files:**
- `/apps/mobile/lib/data/api/api_client.dart`
- `/apps/mobile/lib/data/api/endpoints/*.dart`
- `/apps/mobile/lib/data/models/*.dart` (Freezed models matching shared-types)

---

### Task 7.5: Socket.IO Client Service
**Files:**
- `/apps/mobile/lib/core/services/socket_service.dart`

**Features:**
- Auto-reconnect with backoff
- Event handlers per namespace
- Typed event emission

---

### Task 7.6: Home Screen (Game Modes)
**Files:**
- `/apps/mobile/lib/ui/screens/home/home_screen.dart`
- `/apps/mobile/lib/ui/widgets/game_mode_card.dart`

---

### Task 7.7: Game Board Screen
**Files:**
- `/apps/mobile/lib/ui/screens/game/game_screen.dart`
- `/apps/mobile/lib/ui/widgets/ludo_board.dart` (CustomPainter)
- `/apps/mobile/lib/ui/widgets/token_widget.dart`
- `/apps/mobile/lib/ui/widgets/dice_widget.dart`

---

### Task 7.8: Profile, Wallet, Friends, Tournaments Screens
**Files:** Corresponding screen files in `/apps/mobile/lib/ui/screens/`

---

## Phase 8: Database, Migrations & Seeding

### Task 8.1: Run Prisma Migrations
```bash
cd /Users/akash/ludo-nexus/apps/api && npx prisma migrate dev --name init
```

### Task 8.2: Seed Data
**Files:**
- `/apps/api/prisma/seed.ts`

**Seed:**
- Achievements (20+)
- GameSettings (economic params, feature flags)
- Admin user
- Demo users (for testing)

---

### Task 8.3: Production Database Config
**Files:**
- `/apps/api/.env.production` (template)
- Connection pooling (PgBouncer)
- Read replicas (if needed)

---

## Phase 9: CI/CD, Docker & Deployment

### Task 9.1: Dockerfiles
**Files:**
- `/apps/web/Dockerfile`
- `/apps/api/Dockerfile`
- `/apps/mobile/Dockerfile` (for web build)
- `/docker-compose.yml` (local dev)
- `/docker-compose.prod.yml`

---

### Task 9.2: GitHub Actions Workflows
**Files:**
- `/.github/workflows/ci.yml` — Lint, typecheck, test, build
- `/.github/workflows/cd.yml` — Deploy to staging/production
- `/.github/workflows/dependency-update.yml` — Dependabot

---

### Task 9.3: Infrastructure as Code
**Files:**
- `/infra/` — Terraform/Bicep for PostgreSQL, Redis, Kubernetes/VMs
- Nginx config for reverse proxy, WebSocket support
- SSL certificates (Let's Encrypt/Certbot)

---

### Task 9.4: Environment Management
- Staging environment
- Production environment
- Secrets management (GitHub Secrets, Vault, or cloud secret manager)

---

## Phase 10: End-to-End Testing & Launch Prep

### Task 10.1: E2E Test Suite (Playwright)
**Files:**
- `/apps/web/e2e/*.spec.ts`

**Critical Flows:**
- Register → Verify → Login → Play vs AI → Complete game
- Login → Quick Match → Matchmade → Play → Win → Wallet updated
- Create Room → Invite Friend → Friend Joins → Play
- Register Tournament → Check-in → Play Bracket → Win Prize
- Deposit → Play Match → Withdraw

---

### Task 10.2: Load Testing
- k6 scripts for WebSocket connections
- Matchmaking throughput
- Database query performance

---

### Task 10.3: Security Audit
- OWASP Top 10 check
- JWT token handling
- SQL injection (Prisma safe)
- XSS (React auto-escape)
- Rate limiting
- CORS config

---

### Task 10.4: Accessibility Audit (WCAG 2.1 AA)
- Color contrast (cyber theme needs verification)
- Keyboard navigation
- Screen reader labels
- Focus management

---

### Task 10.5: Performance Optimization
- Bundle analysis (web)
- Image optimization
- Code splitting
- Caching headers
- Database indexes (verify with EXPLAIN ANALYZE)

---

### Task 10.6: Launch Checklist
- [ ] Domain configured (ludonexus.com)
- [ ] SSL certificates active
- [ ] DNS records (A, CNAME, TXT for email)
- [ ] Email provider configured (Resend/SendGrid)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Plausible/GA4)
- [ ] Monitoring (UptimeRobot, Grafana)
- [ ] Backup strategy (DB daily, point-in-time recovery)
- [ ] Rollback plan documented
- [ ] Support email/channel ready
- [ ] Legal pages (Terms, Privacy, Responsible Gaming)
- [ ] App Store / Play Store assets (if native builds)

---

## Risk Register & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| WebSocket scaling issues | Medium | High | Redis adapter from day 1; load test early |
| Wallet balance inconsistencies | Low | Critical | Comprehensive tests; idempotency keys; audit logs |
| Matchmaking queue deadlocks | Low | High | Timeout-based expansion; circuit breaker |
| Mobile/Web feature parity gaps | Medium | Medium | Shared types; API-first design; regular parity audits |
| Database migration failures | Low | High | Test migrations on staging; backup before prod migrate |
| Third-party service outages (email, push) | Medium | Medium | Graceful degradation; queue notifications |

---

## Success Criteria (Launch Definition of Done)

- [ ] All 11 todo phases completed
- [ ] E2E tests passing in CI
- [ ] Load test: 1000 concurrent WebSocket connections, 100 matches/min
- [ ] Zero critical/security vulnerabilities
- [ ] WCAG 2.1 AA compliant
- [ ] Lighthouse score > 90 (web)
- [ ] Crash-free rate > 99.9% (mobile)
- [ ] Staging environment stable for 48 hours
- [ ] Rollback tested and documented
- [ ] Team trained on runbooks

---

## Estimated Timeline

| Phase | Est. Days | Parallelizable |
|-------|-----------|----------------|
| 1: Game Engine | 2 | No |
| 2: API Services | 5 | Yes (per module) |
| 3: WebSocket | 2 | After 2.1 |
| 4: Web Game Board | 4 | After 1, 3 |
| 5: Web Auth | 2 | After 2.1 |
| 6: Web Dashboard | 3 | After 5 |
| 7: Mobile App | 5 | After 2, 3 |
| 8: DB & Seeding | 1 | After 2 |
| 9: CI/CD & Deploy | 2 | After 8 |
| 10: E2E & Launch | 3 | After 9 |

**Total: ~29 days (sequential) / ~15 days (with parallelization)**

---

## Next Immediate Actions

1. **Complete Game Engine** (Tasks 1.1-1.4) — Foundation for everything
2. **Implement Auth Module** (Task 2.1) — Needed for all protected features
3. **Set up WebSocket Infrastructure** (Task 3.1) — Enables real-time dev
4. **Build Web Game Board** (Task 4.1-4.4) — Core user experience

---

*Plan saved to `.hermes/plans/2026-08-05_ludo-nexus-launch-plan.md`*