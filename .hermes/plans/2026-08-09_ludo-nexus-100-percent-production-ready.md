# Ludo Nexus — 100% Production-Ready Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Transform Ludo Nexus from ~55% to 100% production-ready — all critical blockers resolved, full E2E tested, deployable with confidence.

**Architecture:** pnpm monorepo (Turborepo) with Next.js 15 (web), NestJS (API), Flutter (mobile), shared packages. Server-authoritative game engine with Socket.IO real-time.

**Tech Stack:**
- Frontend: Next.js 15, React 18, Tailwind CSS, Framer Motion, Socket.IO Client, TanStack Query
- Backend: NestJS, Prisma ORM, Socket.IO, PostgreSQL, Redis, JWT Auth
- Mobile: Flutter (Dart), Flame game engine, socket_io_client
- Game Engine: Pure TypeScript (packages/game-engine) — 132 tests, 94.78% coverage
- Deploy: Vercel (web), Render (API + PostgreSQL + Redis)

---

## Phase 0: Foundation & Verification (Day 1)

### Task 0.1: Verify Current Build Status & Document Baseline

**Objective:** Establish exact current state before any changes

**Files:**
- Read: `apps/api/package.json`, `apps/web/package.json`
- Run: Build commands to capture current errors

**Steps:**
```bash
# Check API build
cd /Users/akash/ludo-nexus/apps/api && pnpm build 2>&1 | tee /tmp/api-build.log

# Check Web build
cd /Users/akash/ludo-nexus/apps/web && pnpm build 2>&1 | tee /tmp/web-build.log

# Check game-engine tests
cd /Users/akash/ludo-nexus/packages/game-engine && pnpm test 2>&1 | tee /tmp/game-engine-test.log
```

**Verification:**
- API build errors documented in `/tmp/api-build.log`
- Web build passes (should already)
- Game engine tests: 132 pass, 94.78% coverage maintained

---

## Phase 1: API Server — Critical Path (Days 1-3)

### Task 1.1: Fix API TypeScript Build Errors

**Objective:** Get `apps/api/dist/` populated with compiled JS

**Files:**
- Modify: `apps/api/tsconfig.json` (if needed)
- Modify: `apps/api/src/**/*.ts` (fix TypeScript errors)
- Test: `apps/api/dist/` exists with `.js` files

**Steps:**
1. Run `cd apps/api && pnpm build 2>&1` to get error list
2. Fix each TypeScript error systematically
3. Common issues: missing imports, type mismatches, strict mode violations
4. Re-run build until clean

**Verification:**
```bash
ls -la apps/api/dist/
# Should show: main.js, *.js files, not empty
```

### Task 1.2: Implement WebSocket Gateway Events (5 TODOs)

**Objective:** Replace all `// TODO: Emit via WebSocket gateway` in `game.service.ts` with real Socket.IO emissions

**Files:**
- Modify: `apps/api/src/game/game.service.ts` (lines ~200, 280, 350, 400)
- Modify: `apps/api/src/game/game.gateway.ts` (add event types/constants)
- Test: `apps/api/src/game/game.service.spec.ts` (add tests for emissions)

**WebSocket Events to Implement:**
```typescript
// Event names (add to game.gateway.ts)
export const GAME_EVENTS = {
  DICE_ROLLED: 'game:dice_rolled',
  TOKEN_MOVED: 'game:token_moved',
  TOKEN_CAPTURED: 'game:token_captured',
  TURN_CHANGED: 'game:turn_changed',
  MATCH_COMPLETED: 'game:match_completed',
  PLAYER_RECONNECTED: 'game:player_reconnected',
  PLAYER_DISCONNECTED: 'game:player_disconnected',
  ERROR: 'game:error',
} as const;
```

**5 TODO Locations in game.service.ts:**
1. After dice roll (line ~200) → emit `GAME_EVENTS.DICE_ROLLED`
2. After token move (line ~280) → emit `GAME_EVENTS.TOKEN_MOVED`
3. After capture (line ~350) → emit `GAME_EVENTS.TOKEN_CAPTURED`
4. After turn change (line ~400) → emit `GAME_EVENTS.TURN_CHANGED`
5. On match completion → emit `GAME_EVENTS.MATCH_COMPLETED`

**Implementation Pattern:**
```typescript
// In game.service.ts methods, after state change:
this.server.to(matchId).emit(GAME_EVENTS.TOKEN_MOVED, {
  matchId,
  playerId: currentPlayer.userId,
  tokenId,
  fromPosition,
  toPosition,
  diceValue: diceRoll.value,
  capturedTokens,
  nextPlayerId: nextPlayer?.userId,
  gameState: newGameState, // or serializePublicState
});
```

**Verification:**
```bash
# Build passes
cd apps/api && pnpm build

# Unit tests pass
cd apps/api && pnpm test

# Search for remaining TODOs
grep -rn "TODO: Emit via WebSocket" apps/api/src/
# Should return 0 results
```

### Task 1.3: Add Prisma Schema & Database Models

**Objective:** Ensure all required models exist for multiplayer, tournaments, wallet, admin

**Files:**
- Read: `apps/api/prisma/schema.prisma`
- Modify: Add missing models if needed

**Required Models:**
- User (✓ exists)
- Match (✓ exists)
- Tournament (check)
- Transaction/Wallet (check)
- AuditLog (for admin)

**Verification:**
```bash
cd apps/api && npx prisma validate
cd apps/api && npx prisma generate
```

### Task 1.4: Implement Core API Modules

**Objective:** Complete REST endpoints for matchmaking, tournaments, wallet, admin

**Files:**
- Create/Modify: `apps/api/src/auth/`, `apps/api/src/match/`, `apps/api/src/tournament/`, `apps/api/src/wallet/`, `apps/api/src/admin/`

**Endpoints Needed:**
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/verify-otp

GET    /matches/:id
POST   /matches/create
POST   /matches/:id/join
POST   /matches/:id/leave
GET    /matches (list with filters)

POST   /tournaments/create
GET    /tournaments/:id
POST   /tournaments/:id/register
GET    /tournaments (list)

GET    /wallet/balance
POST   /wallet/deposit (demo)
POST   /wallet/withdraw (demo)
GET    /wallet/history

GET    /admin/users
GET    /admin/matches
GET    /admin/tournaments
GET    /admin/transactions
GET    /admin/audit-logs
```

**Verification:** All endpoints return 200/201 with correct types, Swagger docs at `/api/docs`

### Task 1.5: Add Authentication Guards & Rate Limiting

**Objective:** Secure all endpoints, prevent abuse

**Files:**
- Modify: `apps/api/src/auth/jwt.strategy.ts`
- Modify: `apps/api/src/auth/jwt-auth.guard.ts`
- Modify: `apps/api/src/common/guards/rate-limit.guard.ts`

**Verification:**
- Invalid JWT returns 401
- Rate limit returns 429 after threshold
- Admin endpoints require admin role

---

## Phase 2: Web Frontend — Game Page Componentization (Days 2-4)

### Task 2.1: Analyze 39KB Monolith & Design Component Split

**Objective:** Map current `page.tsx` to 7 focused components

**Files:**
- Read: `apps/web/src/app/game/[matchId]/page.tsx` (full)
- Create: `apps/web/src/app/game/[matchId]/components/` (directory)

**Component Breakdown:**
| Component | Responsibility | Est. Size |
|-----------|---------------|-----------|
| `GameBoard` | Board rendering, token positions, safe cells, home lanes | ~8KB |
| `GameToken` | Individual token with color, animation, capture effect | ~3KB |
| `GameDice` | Dice roll animation, value display, roll button | ~4KB |
| `PlayerHand` | Current player's tokens in home, clickable to move | ~4KB |
| `GameSidebar` | Player list, scores, turn indicator, chat toggle | ~5KB |
| `GameChat` | In-game chat, system messages, emoji picker | ~4KB |
| `GameHeader` | Match info, timer, reconnection status, leave button | ~3KB |
| `useGameSocket` | **Hook** — Socket.IO connection, events, reconnection | ~5KB |

### Task 2.2: Create `useGameSocket` Hook (Foundation)

**Objective:** Extract all Socket.IO logic into reusable hook with reconnection handling

**Files:**
- Create: `apps/web/src/app/game/[matchId]/hooks/useGameSocket.ts`
- Modify: `apps/web/src/app/game/[matchId]/page.tsx` (import hook)

**Hook Interface:**
```typescript
interface UseGameSocketReturn {
  // Connection state
  isConnected: boolean;
  isReconnecting: boolean;
  reconnectionAttempt: number;
  
  // Game state
  gameState: GameState | null;
  
  // Actions
  rollDice: () => Promise<void>;
  moveToken: (tokenId: number, toPosition: number) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  
  // Event handlers (set by components)
  onDiceRolled: (data: DiceRolledEvent) => void;
  onTokenMoved: (data: TokenMovedEvent) => void;
  onTokenCaptured: (data: TokenCapturedEvent) => void;
  onTurnChanged: (data: TurnChangedEvent) => void;
  onMatchCompleted: (data: MatchCompletedEvent) => void;
  onError: (error: GameErrorEvent) => void;
}
```

**Verification:**
- Hook compiles without errors
- Handles reconnection with visual feedback
- Emits typed events to components

### Task 2.3: Create `GameBoard` Component

**Objective:** Render board with tokens, safe cells, home lanes, animations

**Files:**
- Create: `apps/web/src/app/game/[matchId]/components/GameBoard.tsx`
- Create: `apps/web/src/app/game/[matchId]/components/GameBoard.styles.css` (or Tailwind)

**Props:**
```typescript
interface GameBoardProps {
  gameState: GameState;
  currentPlayerId: string;
  legalMoves: LegalMove[];
  onTokenClick: (tokenId: number) => void;
  onCellClick: (position: number) => void;
  tokens: Map<string, TokenVisualState>; // For animations
}
```

**Features:**
- SVG/Canvas board rendering (responsive)
- Token positions animated with Framer Motion
- Safe cells highlighted
- Home lanes per player color
- Legal move indicators (pulse/glow)
- Touch/mouse support

### Task 2.4: Create `GameToken` Component

**Objective:** Individual token with color, state, animations

**Files:**
- Create: `apps/web/src/app/game/[matchId]/components/GameToken.tsx`

**Features:**
- Color-coded by player
- States: in-home, on-board, in-home-lane, finished
- Animations: move along path, capture (shake + return), finish (celebration)
- Clickable when legal move

### Task 2.5: Create `GameDice` Component

**Objective:** Dice with roll animation, value display, disabled states

**Files:**
- Create: `apps/web/src/app/game/[matchId]/components/GameDice.tsx`

**Features:**
- 3D CSS dice roll animation
- Value 1-6 display
- Disabled when not player's turn or already rolled
- "Roll" button with loading state
- Sound effect (optional)

### Task 2.6: Create `PlayerHand` Component

**Objective:** Show current player's tokens in home, clickable to enter board

**Files:**
- Create: `apps/web/src/app/game/[matchId]/components/PlayerHand.tsx`

**Features:**
- 4 tokens in home area
- Highlight enterable tokens on roll of 6 (or entry roll)
- Click to move to start position

### Task 2.7: Create `GameSidebar` + `GameChat` + `GameHeader`

**Objective:** Complete UI chrome around board

**Files:**
- Create: `apps/web/src/app/game/[matchId]/components/GameSidebar.tsx`
- Create: `apps/web/src/app/game/[matchId]/components/GameChat.tsx`
- Create: `apps/web/src/app/game/[matchId]/components/GameHeader.tsx`

**Sidebar:** Player avatars, colors, token counts, turn indicator, team scores
**Chat:** Messages list, input, emoji, system messages (captures, wins)
**Header:** Match ID, timer, reconnection banner, leave/forfeit buttons

### Task 2.8: Assemble New Page & Add Error Boundaries

**Objective:** Replace monolith with composed components, wrap in error boundaries

**Files:**
- Modify: `apps/web/src/app/game/[matchId]/page.tsx` (replace with composition)
- Create: `apps/web/src/components/GameErrorBoundary.tsx`

**New page.tsx Structure:**
```tsx
// page.tsx (target: ~2KB)
import { GameBoard } from './components/GameBoard';
import { GameDice } from './components/GameDice';
import { PlayerHand } from './components/PlayerHand';
import { GameSidebar } from './components/GameSidebar';
import { GameChat } from './components/GameChat';
import { GameHeader } from './components/GameHeader';
import { useGameSocket } from './hooks/useGameSocket';
import { GameErrorBoundary } from '@/components/GameErrorBoundary';

export default function GamePage({ params }: { params: { matchId: string } }) {
  const { matchId } = params;
  const socket = useGameSocket(matchId);
  
  return (
    <GameErrorBoundary fallback={<GameErrorFallback />}>
      <GameHeader matchId={matchId} socket={socket} />
      <div className="flex h-[calc(100vh-80px)]">
        <GameSidebar gameState={socket.gameState} />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <GameBoard 
            gameState={socket.gameState}
            currentPlayerId={socket.currentUserId}
            legalMoves={socket.legalMoves}
            onTokenClick={socket.selectToken}
          />
          <div className="flex gap-4 mt-4">
            <GameDice onRoll={socket.rollDice} disabled={!socket.isMyTurn} />
            <PlayerHand tokens={socket.myTokensInHome} onTokenClick={socket.selectToken} />
          </div>
        </div>
        <GameChat messages={socket.chatMessages} onSend={socket.sendChatMessage} />
      </div>
    </GameErrorBoundary>
  );
}
```

**Error Boundary:**
```tsx
// GameErrorBoundary.tsx
export class GameErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Game Error:', error, info);
    // Send to error tracking (Sentry, etc.)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

**Verification:**
- `wc -l apps/web/src/app/game/[matchId]/page.tsx` < 100 lines
- Each component < 200 lines
- Build passes: `cd apps/web && pnpm build`
- Typecheck passes: `cd apps/web && pnpm typecheck`
- No console errors in browser

---

## Phase 3: Reconnection UX & Polish (Day 4-5)

### Task 3.1: Visual Reconnection Indicators

**Objective:** Clear user feedback during disconnect/reconnect

**Files:**
- Modify: `apps/web/src/app/game/[matchId]/components/GameHeader.tsx`
- Modify: `hooks/useGameSocket.ts`

**States to Show:**
- 🟢 Connected (green dot)
- 🟡 Reconnecting... (yellow pulse, attempt counter)
- 🔴 Disconnected (red, "Connection lost — retrying")
- 🔄 Syncing... (spinner, "Restoring game state")

### Task 3.2: State Synchronization on Reconnect

**Objective:** Seamless restore after reconnection

**Files:**
- Modify: `apps/api/src/game/game.gateway.ts` (handle reconnection)
- Modify: `hooks/useGameSocket.ts` (request full state on reconnect)

**Flow:**
1. Client reconnects → sends `rejoin-match` with `matchId` + `userId`
2. Server validates → emits full `gameState` + `legalMoves`
3. Client updates UI → shows "Synced" briefly → resumes

### Task 3.3: Bot Difficulty Configuration

**Objective:** Move hardcoded bot weights to config/env

**Files:**
- Modify: `packages/game-engine/src/bot/botAI.ts`
- Create: `packages/game-engine/src/bot/botConfig.ts`
- Modify: `apps/api/.env.example` (add bot config vars)

**Config Structure:**
```typescript
// botConfig.ts
export const BOT_DIFFICULTY_CONFIG = {
  easy: {
    weightCapture: 0.3,
    weightProgress: 0.4,
    weightSafety: 0.2,
    weightBlockade: 0.1,
    lookaheadDepth: 1,
    randomnessFactor: 0.4,
  },
  medium: {
    weightCapture: 0.5,
    weightProgress: 0.3,
    weightSafety: 0.15,
    weightBlockade: 0.05,
    lookaheadDepth: 2,
    randomnessFactor: 0.2,
  },
  hard: {
    weightCapture: 0.6,
    weightProgress: 0.25,
    weightSafety: 0.1,
    weightBlockade: 0.05,
    lookaheadDepth: 3,
    randomnessFactor: 0.1,
  },
} as const;

// Allow env override
export function getBotConfig(difficulty: 'easy' | 'medium' | 'hard') {
  const base = BOT_DIFFICULTY_CONFIG[difficulty];
  return {
    ...base,
    weightCapture: Number(process.env[`BOT_${difficulty.toUpperCase()}_WEIGHT_CAPTURE`]) ?? base.weightCapture,
    // ... other weights
  };
}
```

**Verification:**
- Bots still work with defaults
- Env vars override weights correctly
- Tests pass with different configs

---

## Phase 4: Admin Panel (Days 5-7)

### Task 4.1: Initialize Admin Next.js App

**Objective:** Create `apps/admin` with same stack as web

**Files:**
- Run: `cd apps/admin && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias @/* --use-pnpm --no-git`

**Structure:**
```
apps/admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (dashboard)
│   │   ├── users/
│   │   ├── matches/
│   │   ├── tournaments/
│   │   ├── transactions/
│   │   └── audit-logs/
│   ├── components/
│   │   ├── DataTable.tsx
│   │   ├── StatCard.tsx
│   │   └── AdminLayout.tsx
│   └── lib/
│       └── api.ts (admin API client)
```

### Task 4.2: Admin Authentication & Layout

**Objective:** Protect admin routes, shared layout with sidebar navigation

**Files:**
- Create: `apps/admin/src/middleware.ts` (auth check)
- Create: `apps/admin/src/components/AdminLayout.tsx`
- Create: `apps/admin/src/components/AdminSidebar.tsx`

**Middleware:** Verify JWT + admin role, redirect to login if not authorized

### Task 4.3: Admin Dashboard Pages

**Objective:** Functional CRUD pages for each domain

**Pages:**
| Page | Features |
|------|----------|
| `/` (Dashboard) | Stats cards: total users, active matches, revenue, tournaments |
| `/users` | Table: search, filter, pagination, view/edit/ban user |
| `/matches` | Table: filter by status/mode, view match details, replay |
| `/tournaments` | Create, bracket view, manage participants |
| `/transactions` | Filter by type/user/date, export CSV |
| `/audit-logs` | Filter by action/user/date, immutable |

**Shared Component:** `DataTable` with sorting, filtering, pagination, row actions

### Task 4.4: Admin API Integration

**Objective:** Connect admin UI to API endpoints

**Files:**
- Create: `apps/admin/src/lib/api.ts` (authenticated fetch wrapper)
- Modify: Each page to fetch data from API

**API Endpoints Used:**
- GET `/admin/stats`
- GET `/admin/users?page=&limit=&search=`
- GET `/admin/matches?status=&mode=`
- GET `/admin/tournaments`
- GET `/admin/transactions`
- GET `/admin/audit-logs`

**Verification:**
- Admin builds: `cd apps/admin && pnpm build`
- All pages load data
- Role-based access works

---

## Phase 5: Mobile App — Flutter Game (Days 7-12)

### Task 5.1: Set Up Flutter Dependencies & Structure

**Objective:** Add game engine port, Socket.IO, Flame for rendering

**Files:**
- Modify: `apps/mobile/pubspec.yaml`
- Create: `apps/mobile/lib/core/`, `apps/mobile/lib/ui/game/`, `apps/mobile/lib/services/`

**pubspec.yaml Additions:**
```yaml
dependencies:
  flame: ^1.17.0
  socket_io_client: ^2.0.3
  provider: ^6.1.1
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0
  http: ^1.2.0
```

### Task 5.2: Port Game Engine Logic to Dart

**Objective:** Replicate core game logic in Dart for client-side prediction/optimistic UI

**Files:**
- Create: `apps/mobile/lib/core/game/board.dart`
- Create: `apps/mobile/lib/core/game/rules.dart`
- Create: `apps/mobile/lib/core/game/engine.dart`
- Create: `apps/mobile/lib/core/game/bot_ai.dart`

**Key Classes:**
- `Board` — positions, safe cells, home lanes
- `GameRules` — entry roll, extra turns, blockades
- `GameEngine` — `getLegalMoves()`, `moveToken()`, `checkCaptures()`
- `BotAI` — 3 difficulty tiers (port from TS)

**Note:** This enables optimistic UI — show moves instantly, sync with server

### Task 5.3: Socket.IO Service & Game State Management

**Objective:** Real-time connection to API, state sync, reconnection

**Files:**
- Create: `apps/mobile/lib/services/socket_service.dart`
- Create: `apps/mobile/lib/services/auth_service.dart`
- Create: `apps/mobile/lib/providers/game_provider.dart` (Provider/Bloc)

**Socket Events to Handle:**
- `game:dice_rolled`
- `game:token_moved`
- `game:token_captured`
- `game:turn_changed`
- `game:match_completed`
- `game:error`

### Task 5.4: Game Board UI with Flame

**Objective:** Render Ludo board, tokens, animations using Flame game engine

**Files:**
- Create: `apps/mobile/lib/ui/game/ludo_game.dart` (Flame Game class)
- Create: `apps/mobile/lib/ui/game/components/board_component.dart`
- Create: `apps/mobile/lib/ui/game/components/token_component.dart`
- Create: `apps/mobile/lib/ui/game/components/dice_component.dart`
- Create: `apps/mobile/lib/ui/game/components/home_lane_component.dart`

**Flame Components:**
- `BoardComponent` — static board rendering (SVG → Canvas)
- `TokenComponent` — animated token with position interpolation
- `DiceComponent` — 3D dice roll animation
- `HomeLaneComponent` — player's home lane

**Animations:**
- Token move: position tween along path
- Capture: shake + return to home
- Dice roll: rotation + bounce
- Finish: scale + fade celebration

### Task 5.5: Game Screen & UI Integration

**Objective:** Assemble game screen with board, controls, chat, player info

**Files:**
- Create: `apps/mobile/lib/ui/game/game_screen.dart`
- Create: `apps/mobile/lib/ui/game/widgets/player_panel.dart`
- Create: `apps/mobile/lib/ui/game/widgets/chat_widget.dart`
- Create: `apps/mobile/lib/ui/game/widgets/turn_indicator.dart`

**Screen Layout:**
```
AppBar: Match ID, timer, reconnection status
Body: 
  - Top: Opponent panel (tokens left, avatar)
  - Center: LudoGame (Flame) — board + tokens
  - Bottom: Current player panel (dice, tokens in home, chat)
```

### Task 5.6: Matchmaking & Lobby Screens

**Objective:** Create room, join by code, quick match, tournament browser

**Files:**
- Create: `apps/mobile/lib/ui/lobby/lobby_screen.dart`
- Create: `apps/mobile/lib/ui/lobby/create_room_dialog.dart`
- Create: `apps/mobile/lib/ui/lobby/join_room_dialog.dart`
- Create: `apps/mobile/lib/ui/lobby/tournament_list.dart`

### Task 5.7: Auth Screens & Persistence

**Objective:** Login, register, OTP, token storage, auto-login

**Files:**
- Create: `apps/mobile/lib/ui/auth/login_screen.dart`
- Create: `apps/mobile/lib/ui/auth/register_screen.dart`
- Create: `apps/mobile/lib/ui/auth/otp_screen.dart`
- Modify: `auth_service.dart` (secure storage)

### Task 5.8: Mobile Build Configuration

**Objective:** `eas.json`, `app.json` for iOS/Android store builds

**Files:**
- Create: `apps/mobile/eas.json`
- Modify: `apps/mobile/app.json`

**eas.json:**
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "android": { "buildType": "apk" } },
    "production": { "android": { "buildType": "aab" }, "ios": { "enterprise": false } }
  },
  "submit": {
    "production": { "android": { "serviceAccountKeyPath": "./google-play-key.json" }, "ios": { "appleId": "your@email.com", "ascAppId": "123456789" } }
  }
}
```

**app.json:** Bundle ID, version, icons, splash, permissions

**Verification:**
- `cd apps/mobile && flutter analyze` — no errors
- `cd apps/mobile && flutter test` — passes
- `eas build --platform android --profile preview` — succeeds

---

## Phase 6: E2E Testing & Polish (Days 12-14)

### Task 6.1: Web E2E Tests (Playwright)

**Objective:** Critical user flows verified

**Files:**
- Create: `apps/web/tests/e2e/game-flow.spec.ts`
- Create: `apps/web/tests/e2e/auth-flow.spec.ts`
- Create: `apps/web/tests/e2e/reconnection.spec.ts`

**Test Scenarios:**
1. Register → Login → Create Room → Join → Play full game → Win
2. Reconnection: Disconnect network → Reconnect → State restored
3. Bot game: Play vs Easy/Medium/Hard bot
4. Tournament: Create → Register → Play bracket

### Task 6.2: API Integration Tests

**Objective:** WebSocket events, REST endpoints, auth

**Files:**
- Create: `apps/api/test/integration/game-flow.test.ts`
- Create: `apps/api/test/integration/auth.test.ts`

### Task 6.3: Load Testing (100+ Concurrent)

**Objective:** Verify Socket.IO + Redis adapter scales

**Tool:** k6 or Artillery
**Scenario:** 100 users, 25 concurrent matches, 5 min duration
**Pass Criteria:** < 5% error rate, p99 latency < 500ms

### Task 6.4: Security Audit

**Objective:** OWASP top 10, JWT security, rate limiting, input validation

**Checklist:**
- [ ] JWT secrets rotated, strong (32+ chars)
- [ ] Rate limiting on all endpoints
- [ ] Input validation (Zod) on all REST + WS
- [ ] CORS restricted to frontend domain
- [ ] Helmet headers present
- [ ] SQL injection prevented (Prisma parameterized)
- [ ] XSS prevented (React auto-escape + CSP)
- [ ] No secrets in code/logs

---

## Phase 7: Deployment Preparation (Day 14-15)

### Task 7.1: Production Environment Variables

**Objective:** All secrets configured in Vercel/Render

**Render (API):**
- DATABASE_URL (PostgreSQL)
- REDIS_URL
- JWT_SECRET, JWT_REFRESH_SECRET
- CORS_ORIGIN, FRONTEND_URL
- OTP_DEV_MODE=false

**Vercel (Web):**
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_SOCKET_URL

**Render (Admin) — Optional separate deploy or same as web**

### Task 7.2: Database Migration Strategy

**Objective:** Zero-downtime migrations

**Files:**
- Verify: `apps/api/prisma/migrations/` complete
- Script: `npx prisma migrate deploy` in pre-deploy

### Task 7.3: Health Checks & Monitoring

**Objective:** Observability in production

**Endpoints:**
- GET `/health` — liveness (Render)
- GET `/ready` — readiness (DB + Redis connected)

**Monitoring:**
- Vercel Analytics
- Render Metrics (CPU, Memory, Latency)
- Error tracking (Sentry) — both web + API

---

## File Change Summary

### New Files (~50+)
```
apps/api/src/game/game.gateway.ts (enhanced)
apps/api/src/auth/ (complete module)
apps/api/src/match/ (complete module)
apps/api/src/tournament/ (complete module)
apps/api/src/wallet/ (complete module)
apps/api/src/admin/ (complete module)
apps/api/src/common/guards/ (rate limit, roles)
apps/web/src/app/game/[matchId]/hooks/useGameSocket.ts
apps/web/src/app/game/[matchId]/components/GameBoard.tsx
apps/web/src/app/game/[matchId]/components/GameToken.tsx
apps/web/src/app/game/[matchId]/components/GameDice.tsx
apps/web/src/app/game/[matchId]/components/PlayerHand.tsx
apps/web/src/app/game/[matchId]/components/GameSidebar.tsx
apps/web/src/app/game/[matchId]/components/GameChat.tsx
apps/web/src/app/game/[matchId]/components/GameHeader.tsx
apps/web/src/components/GameErrorBoundary.tsx
apps/admin/ (entire Next.js app)
apps/mobile/lib/core/game/ (Dart port)
apps/mobile/lib/services/ (socket, auth)
apps/mobile/lib/providers/ (game state)
apps/mobile/lib/ui/game/ (Flame components)
apps/mobile/lib/ui/lobby/ (matchmaking)
apps/mobile/lib/ui/auth/ (auth screens)
apps/mobile/eas.json
apps/mobile/app.json (updated)
```

### Modified Files (~20+)
```
apps/api/prisma/schema.prisma
apps/api/src/game/game.service.ts (5 WebSocket TODOs fixed)
apps/api/src/main.ts (global guards, pipes)
apps/web/src/app/game/[matchId]/page.tsx (refactored)
apps/web/src/app/layout.tsx (Socket provider)
packages/game-engine/src/bot/botAI.ts (configurable)
packages/game-engine/src/bot/botConfig.ts (new)
```

---

## Verification Checklist (100% Production Ready)

- [ ] **Admin panel** deployed and functional at `/admin`
- [ ] **Mobile app** builds for iOS (`.ipa`) and Android (`.aab`)
- [ ] **API server** builds (`dist/` exists) and starts without errors
- [ ] **All WebSocket events** emitted (0 TODOs remaining)
- [ ] **Game page componentized** (page.tsx < 2KB, 7 components < 200 lines each)
- [ ] **Error boundaries** on game page (catch render errors)
- [ ] **Reconnection UX** with visual indicators (4 states)
- [ ] **Bot difficulty configurable** via env vars
- [ ] **Mobile builds** pass for App Store / Play Store
- [ ] **Full E2E tests passing** (2+ players, reconnection, bot games)
- [ ] **Load test passed** (100+ concurrent users)
- [ ] **Security audit passed** (OWASP top 10)
- [ ] **Database migrations** run automatically on deploy
- [ ] **Health checks** responding
- [ ] **Monitoring/alerting** configured

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| API build has deep TypeScript errors | High | Fix incrementally, use `any` temporarily only if blocked, add `// TODO: fix type` |
| Flutter game engine port diverges from TS | Medium | Write Dart tests mirroring TS tests, compare outputs |
| WebSocket reconnection edge cases | High | Comprehensive reconnection tests, chaos testing |
| Mobile Flame performance on low-end | Medium | Profile, reduce particle effects, option for simple rendering |
| Admin panel scope creep | Low | Strict MVP: read-only dashboard first, add write ops later |

---

## Execution Order (Dependency-Aware)

```
Week 1: Phase 0 → Phase 1 (1.1-1.5) → Phase 2 (2.1-2.3)
Week 2: Phase 2 (2.4-2.8) → Phase 3 → Phase 4 (4.1-4.4)
Week 3: Phase 5 (5.1-5.5)
Week 4: Phase 5 (5.6-5.8) → Phase 6
Week 5: Phase 7 → Final verification → Deploy
```

---

## Daily Standup Template

```markdown
### REPLY FROM DEVELOPMENT AGENT - [TIMESTAMP]
**Status:** [Current phase/task]
**Progress:** [What's done since last check]
**Blockers:** [Any issues needing help]
**Questions for Review Agent:** [If any]
**Next Steps:** [What you'll do next]
```

Write updates in: `DEVELOPMENT_AGENT_COMMUNICATION.md`