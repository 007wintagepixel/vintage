---
goal: "Complete Production-Quality Ludo Nexus Application with Demo Mode"
version: "1.0"
date_created: "2026-08-05"
last_updated: "2026-08-05"
owner: "Akash"
status: "Planned"
tags: ["feature", "architecture", "fullstack", "game", "mobile", "web", "flutter", "nestjs", "postgresql", "redis", "websocket"]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This implementation plan covers building a complete, production-quality Ludo Nexus application with the following characteristics:
- Cross-platform: Web (Next.js), Mobile (Flutter), Desktop
- Real-time multiplayer with Socket.IO
- Complete Ludo game engine with server-authoritative logic
- Demo wallet system (no real money)
- Authentication, friends, chat, tournaments, teams
- Admin panel
- Full test coverage and CI/CD

## 1. Requirements & Constraints

### Functional Requirements
- **REQ-001**: User registration with email, phone, username, country, DOB, referral code
- **REQ-002**: OTP verification, password reset, JWT auth with refresh tokens
- **REQ-003**: Home dashboard with player card, game mode cards, bottom navigation
- **REQ-004**: Play vs AI (3 difficulties: Easy, Medium, Hard)
- **REQ-005**: Play vs Human matchmaking with skill-based matching
- **REQ-006**: Group match rooms (public/private, 2-4 players, invite system)
- **REQ-007**: Private match with invite links and QR codes
- **REQ-008**: Team match (2v2) with partner assignment
- **REQ-009**: Tournament system (scheduled, knockout, brackets)
- **REQ-010**: Profile with stats, achievements, edit functionality
- **REQ-011**: Friends system (search, requests, online status, invite)
- **REQ-012**: Chat system (global, match, private, team, support)
- **REQ-013**: Wallet with demo coins, deposit/withdrawal sandbox
- **REQ-014**: KYC-ready workflow (not started → verified)
- **REQ-015**: Admin panel (users, matches, tournaments, transactions, KYC, fraud)
- **REQ-016**: Responsive design for mobile, tablet, desktop
- **REQ-017**: PWA support

### Security Requirements
- **SEC-001**: Server-authoritative game logic (dice, moves, validation)
- **SEC-002**: Cryptographically secure dice generation
- **SEC-003**: JWT access + refresh tokens with rotation
- **SEC-004**: Argon2 password hashing
- **SEC-005**: Rate limiting and brute-force protection
- **SEC-006**: Input validation with Zod on all endpoints
- **SEC-007**: WebSocket authentication and authorization
- **SEC-008**: Idempotency keys for all mutations
- **SEC-009**: Double-entry ledger for wallet
- **SEC-010**: Audit logging for all sensitive operations
- **SEC-011**: Real-money features behind feature flag (disabled by default)

### Technical Constraints
- **CON-001**: Monorepo structure (apps/web, apps/api, apps/mobile, apps/admin, packages/*)
- **CON-002**: Shared packages for game-engine, types, validation, api-client, ui
- **CON-003**: PostgreSQL + Prisma ORM
- **CON-004**: Redis for sessions, caching, pub/sub
- **CON-005**: Docker + Docker Compose for local dev
- **CON-006**: GitHub Actions CI/CD
- **CON-007**: TypeScript strict mode
- **CON-008**: Tailwind CSS + Framer Motion for web
- **CON-009**: Flutter for mobile with shared types
- **CON-010**: Socket.IO for real-time

### Design Guidelines
- **GUD-001**: Futuristic cyber-gaming theme (dark navy/black, neon cyan/magenta/green/gold)
- **GUD-002**: Glassmorphism panels with blur, glowing borders
- **GUD-010**: Accessibility: WCAG AA, keyboard nav, screen readers, reduced motion
- **GUD-011**: Minimum 44x44 touch targets
- **GUD-012**: Responsive typography with clamp()

## 2. Implementation Steps

### Implementation Phase 1: Foundation & Infrastructure

**GOAL-001**: Set up monorepo, shared packages, infrastructure, and CI/CD

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Initialize monorepo with Turborepo or Nx | | |
| TASK-002 | Create package.json workspaces for apps/* and packages/* | | |
| TASK-003 | Set up shared TypeScript config, ESLint, Prettier | | |
| TASK-004 | Create packages/shared-types (Zod schemas, game types, API types) | | |
| TASK-005 | Create packages/validation (shared Zod schemas for forms, API) | | |
| TASK-006 | Create packages/api-client (TanStack Query + Socket.IO client) | | |
| TASK-007 | Create packages/game-engine (pure TypeScript Ludo engine) | | |
| TASK-008 | Create packages/ui (shared React components, design tokens) | | |
| TASK-009 | Set up Docker Compose (PostgreSQL, Redis, Nginx, API, Web) | | |
| TASK-010 | Create .env.example with all required variables | | |
| TASK-011 | Set up GitHub Actions CI (lint, typecheck, test, build) | | |
| TASK-012 | Set up GitHub Actions CD (Docker build, deploy) | | |
| TASK-013 | Create docs/architecture.md | | |
| TASK-014 | Create docs/database-schema.md | | |
| TASK-015 | Create docs/websocket-events.md | | |
| TASK-016 | Create docs/game-rules.md | | |
| TASK-017 | Create docs/security.md | | |
| TASK-018 | Create docs/compliance-readiness.md | | |
| TASK-019 | Create docs/deployment.md | | |

### Implementation Phase 2: Backend API (NestJS)

**GOAL-002**: Build complete backend with auth, game logic, real-time, wallet, admin

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-020 | Initialize NestJS project in apps/api with TypeScript strict | | |
| TASK-021 | Set up Prisma schema (User, Match, Room, Tournament, Wallet, Ledger, Friend, Chat, Achievement, KYC, Admin) | | |
| TASK-022 | Run Prisma migrations and seed demo data | | |
| TASK-023 | Implement AuthModule (register, login, OTP, JWT, refresh, Google/Apple, password reset) | | |
| TASK-024 | Implement UserModule (profile, stats, achievements, settings, KYC) | | |
| TASK-025 | Implement GameEngineModule (server-authoritative Ludo engine) | | |
| TASK-026 | Implement MatchModule (matchmaking, match lifecycle, replay) | | |
| TASK-027 | Implement RoomModule (create, join, lobby, invite, team, settings) | | |
| TASK-028 | Implement TournamentModule (draft, registration, brackets, scheduling) | | |
| TASK-029 | Implement WalletModule (demo coins, double-entry ledger, deposit/withdraw sandbox) | | |
| TASK-030 | Implement FriendModule (requests, search, online status, block) | | |
| TASK-031 | Implement ChatModule (global, match, private, team, moderation) | | |
| TASK-032 | Implement AdminModule (users, matches, tournaments, transactions, KYC, fraud, audit) | | |
| TASK-033 | Implement WebSocket gateway with Socket.IO (auth, rooms, game events, chat) | | |
| TASK-034 | Implement background jobs with BullMQ (match cleanup, tournament scheduling, notifications) | | |
| TASK-035 | Add rate limiting, helmet, CORS, compression | | |
| TASK-036 | Add OpenTelemetry logging, Sentry integration | | |
| TASK-037 | Write unit tests for game engine (Vitest) | | |
| TASK-038 | Write integration tests for API (Supertest) | | |
| TASK-039 | Write WebSocket integration tests | | |

### Implementation Phase 3: Web Frontend (Next.js 15)

**GOAL-003**: Build complete responsive web application with all routes

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-040 | Initialize Next.js 15 in apps/web with TypeScript, Tailwind, App Router | | |
| TASK-041 | Set up design tokens (colors, spacing, typography, shadows, radius) | | |
| TASK-042 | Create global styles, CSS variables for theming, dark mode | | |
| TASK-043 | Build UI component library (Button, Card, Input, Modal, Toast, Dice, Token, Board) | | |
| TASK-044 | Implement layout components (Navbar, BottomNav, Sidebar, PlayerCard) | | |
| TASK-044a | **Extract Game Page Components** - Split 39KB game page into Board, Token, Dice, PlayerHand, Sidebar, Chat, DiceRoll components | | |
| TASK-045 | Implement Auth pages (/, /login, /register, /verify-otp, /forgot-password, /reset-password) | | |
| TASK-046 | Implement public pages (/terms, /privacy, /responsible-gaming, /help) | | |
| TASK-047 | Implement Home dashboard (/home) with player card, mode cards, bottom nav | | |
| TASK-048 | Implement Game Modes page (/game-modes) | | |
| TASK-049 | Implement Matchmaking page (/matchmaking) with queue, cancel, ETA | | |
| TASK-050 | Implement Room pages (/room/create, /room/join, /room/[roomCode]) | | |
| TASK-051 | Implement Game page (/game/[matchId]) with full Ludo board UI | | |
| TASK-051a | **Add Error Boundaries** - Add React error boundaries for game crash protection | | |
| TASK-052 | Implement Ludo board component (responsive, animations, legal moves, dice) | | |
| TASK-052a | **Improve Reconnection UX** - Visual feedback during reconnection, state sync indicators | | |
| TASK-053 | Implement Play vs AI page with difficulty selection | | |
| TASK-053a | **Expose Bot Difficulty Weights** - Configurable weights for tuning bot difficulties | | |
| TASK-054 | Implement Friends pages (/friends, requests, sent, blocked) | | |
| TASK-055 | Implement Chat pages (/chat, /chat/[conversationId]) | | |
| TASK-056 | Implement Wallet pages (/wallet, /wallet/deposit, /wallet/withdraw, /wallet/transactions) | | |
| TASK-057 | Implement Tournament pages (/tournaments, /tournaments/[id]) | | |
| TASK-058 | Implement Leaderboard page (/leaderboard) | | |
| TASK-059 | Implement Profile pages (/profile, /profile/edit, /profile/achievements) | | |
| TASK-060 | Implement Settings page (/settings) | | |
| TASK-061 | Implement Notifications page (/notifications) | | |
| TASK-062 | Implement KYC page (/kyc) | | |
| TASK-063 | Implement Support page (/support) | | |
| TASK-064 | Implement Match History page (/match-history) | | |
| TASK-065 | Implement Referrals page (/referrals) | | |
| TASK-066 | Implement Admin pages (/admin, /admin/*) | | |
| TASK-067 | Add PWA manifest, service worker, offline support | | |
| TASK-068 | Add Framer Motion animations, page transitions | | |
| TASK-069 | Implement responsive breakpoints (mobile, tablet, desktop, large) | | |
| TASK-070 | Write unit tests (Vitest + React Testing Library) | | |
| TASK-071 | Write E2E tests (Playwright) | | |

### Implementation Phase 4: Mobile App (Flutter)

**GOAL-004**: Build Flutter mobile app sharing types and logic with web

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-072 | Initialize Flutter project in apps/mobile | | |
| TASK-073 | Set up go_router for declarative routing | | |
| TASK-074 | Set up dependency injection (get_it or provider) | | |
| TASK-075 | Create shared types generation from packages/shared-types | | |
| TASK-076 | Create API client (Dio + generated types) | | |
| TASK-077 | Create Socket.IO client for real-time | | |
| TASK-078 | Implement UI layer with MVVM (ViewModels + Views) | | |
| TASK-079 | Implement Data layer (Repositories + Services) | | |
| TASK-080 | Implement auth flow (login, register, OTP, biometric) | | |
| TASK-081 | Implement home dashboard with bottom navigation | | |
| TASK-082 | Implement game modes and matchmaking | | |
| TASK-083 | Implement room system (create, join, lobby) | | |
| TASK-084 | Implement Ludo game board with Flutter Canvas/CustomPainter | | |
| TASK-085 | Implement Play vs AI with 3 difficulties | | |
| TASK-086 | Implement Friends and Chat | | |
| TASK-087 | Implement Wallet and Transactions | | |
| TASK-088 | Implement Profile and Settings | | |
| TASK-089 | Implement Tournament and Leaderboard | | |
| TASK-090 | Add platform deep linking (Android App Links, iOS Universal Links) | | |
| TASK-091 | Write unit tests (flutter_test) | | |
| TASK-092 | Write integration tests (integration_test) | | |
| TASK-092a | **Build Expo App for Stores** - Generate production builds for iOS/Android app stores | | |

### Implementation Phase 5: Admin Panel

**GOAL-005**: Build admin panel for platform management

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-093 | Initialize admin app in apps/admin (Next.js or React) | | |
| TASK-094 | Implement admin authentication (separate from user auth) | | |
| TASK-095 | Build admin dashboard with metrics | | |
| TASK-096 | Implement user management (view, ban, verify, KYC review) | | |
| TASK-097 | Implement match management (view, replay, fraud flags) | | |
| TASK-098 | Implement tournament management (create, schedule, brackets) | | |
| TASK-099 | Implement transaction management (view, approve withdrawals) | | |
| TASK-100 | Implement KYC review workflow | | |
| TASK-101 | Implement reports and analytics | | |
| TASK-102 | Implement fraud alerts dashboard | | |
| TASK-103 | Implement game settings configuration | | |
| TASK-104 | Implement audit logs viewer | | |
| TASK-104a | **Build Admin Dashboard** - Deploy admin panel to production | | |

### Implementation Phase 6: Game Engine Polish & Testing

**GOAL-006**: Ensure game engine is production-ready with full test coverage

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-105 | Complete Ludo engine unit tests (100% coverage) | | |
| TASK-106 | Implement bot AI (Easy, Medium, Hard) with tests | | |
| TASK-107 | Add match replay from event log | | |
| TASK-108 | Add reconnection handling with state sync | | |
| TASK-109 | Add spectator mode | | |
| TASK-110 | Load test WebSocket connections | | |
| TASK-111 | Security audit (penetration test game logic) | | |
| TASK-111a | **Error Boundaries Testing** - Test React error boundaries for game crash scenarios | | |
| TASK-111b | **Bot Difficulty Config Testing** - Test configurable bot difficulty weights | | |

### Implementation Phase 7: Demo Mode & Deployment Prep

**GOAL-007**: Finalize demo mode, documentation, and deployment

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-112 | Ensure all real-money features are behind feature flag (disabled) | | |
| TASK-113 | Label all demo balances as "Demo Coins" throughout UI | | |
| TASK-114 | Create mock payment provider for local dev | | |
| TASK-115 | Create comprehensive README with setup instructions | | |
| TASK-116 | Create docker-compose.yml for one-command local startup | | |
| TASK-117 | Test full flow in multiple browser sessions (2+ players) | | |
| TASK-118 | Test mobile app on Android emulator and iOS simulator | | |
| TASK-119 | Test admin panel workflows | | |
| TASK-120 | Run full test suite (unit, integration, E2E) | | |
| TASK-121 | Performance audit (Lighthouse, bundle size) | | |
| TASK-122 | Accessibility audit (axe, manual testing) | | |
| TASK-123 | Create deployment guide for production | | |

## 3. Alternatives

- **ALT-001**: Use React Native instead of Flutter for mobile — Rejected: Flutter provides better performance for game UI, single codebase for mobile/web/desktop, and better custom painting for Ludo board
- **ALT-002**: Use Unity/Godot for game engine — Rejected: Overkill for Ludo; TypeScript engine shares logic with backend, enables server-authoritative validation
- **ALT-003**: Use Firebase instead of custom backend — Rejected: Need full control over game logic, wallet, WebSocket, tournament logic
- **ALT-004**: Use WebRTC for real-time — Rejected: Socket.IO is simpler, works through firewalls, scales with Redis adapter

## 4. Dependencies

### Core Dependencies
- **DEP-001**: Node.js 20+
- **DEP-002**: Flutter 3.22+
- **DEP-003**: Docker 24+
- **DEP-004**: PostgreSQL 16+
- **DEP-005**: Redis 7+
- **DEP-006**: pnpm 9+ (for monorepo)

### Key npm Packages
- **DEP-010**: @nestjs/core, @nestjs/websockets, @nestjs/jwt, @nestjs/bullmq
- **DEP-011**: prisma, @prisma/client
- **DEP-012**: socket.io, @socket.io/redis-adapter
- **DEP-013**: argon2, jsonwebtoken, zod
- **DEP-014**: next@15, react@18, tailwindcss, framer-motion
- **DEP-015**: @tanstack/react-query, zustand, react-hook-form
- **DEP-016**: howler, lucide-react
- **DEP-017**: vitest, @testing-library/react, playwright, supertest

### Key Flutter Packages
- **DEP-020**: flutter, go_router, provider/get_it, dio, socket_io_client
- **DEP-021**: freezed, json_serializable, flutter_secure_storage
- **DEP-022**: flutter_localizations, intl

## 5. Files

### Monorepo Structure
```
ludo-nexus/
├── apps/
│   ├── web/                 # Next.js 15 web app
│   ├── api/                 # NestJS backend
│   ├── mobile/              # Flutter mobile app
│   └── admin/               # Admin panel
├── packages/
│   ├── shared-types/        # TypeScript types, Zod schemas
│   ├── validation/          # Shared validation schemas
│   ├── api-client/          # TanStack Query + Socket.IO client
│   ├── game-engine/         # Pure TS Ludo engine
│   ├── ui/                  # Shared React components
│   ├── config/              # Shared config (ESLint, TS, Tailwind)
│   ├── eslint-config/
│   └── test-utils/
├── infra/
│   ├── docker/
│   ├── nginx/
│   └── deployment/
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── game-rules.md
│   ├── websocket-events.md
│   ├── security.md
│   ├── compliance-readiness.md
│   └── deployment.md
├── docker-compose.yml
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── .env.example
└── README.md
```

### Key Prisma Models
- User, Session, OTP, Profile, KYC
- Match, MatchEvent, MatchPlayer, MatchReplay
- Room, RoomPlayer, RoomInvite
- Tournament, TournamentRegistration, TournamentMatch, TournamentBracket
- Wallet, LedgerEntry, Transaction, PaymentProvider
- Friend, FriendRequest, BlockedUser
- ChatConversation, ChatMessage, ChatParticipant
- Achievement, UserAchievement
- AdminUser, AuditLog, FraudAlert, GameSettings

## 6. Testing

| Test | Description | Tool |
|------|-------------|------|
| TEST-001 | Game engine pure functions (createInitialState, getLegalMoves, validateMove, etc.) | Vitest |
| TEST-002 | Bot AI decision making at each difficulty | Vitest |
| TEST-003 | API auth endpoints (register, login, OTP, refresh) | Supertest |
| TEST-004 | API game endpoints (matchmaking, room, match actions) | Supertest |
| TEST-005 | API wallet endpoints (deposit, withdraw, ledger integrity) | Supertest |
| TEST-006 | WebSocket connection, auth, game events, chat | Socket.IO test utils |
| TEST-007 | Web UI component rendering and interactions | Vitest + RTL |
| TEST-008 | Web E2E: full game flow (2 browsers) | Playwright |
| TEST-009 | Web E2E: auth, wallet, friends, chat | Playwright |
| TEST-010 | Mobile unit tests (ViewModels, Repositories) | flutter_test |
| TEST-011 | Mobile integration tests (full flows) | integration_test |
| TEST-012 | Admin panel E2E | Playwright |

## 7. Risks & Assumptions

- **RISK-001**: WebSocket scaling — Mitigation: Redis adapter, horizontal scaling design
- **RISK-002**: Game state synchronization on reconnection — Mitigation: Versioned state, event log replay
- **RISK-003**: Mobile app store approval for "gaming" — Mitigation: Demo mode only, clear labeling, responsible gaming
- **RISK-004**: Real-money regulation — Mitigation: Feature flag disabled, compliance docs ready
- **ASSUMPTION-001**: Team has TypeScript, NestJS, Next.js, Flutter experience
- **ASSUMPTION-002**: PostgreSQL and Redis available in deployment environment
- **ASSUMPTION-003**: Domain and SSL for production deployment

## 8. Related Specifications / Further Reading

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Flutter Documentation](https://docs.flutter.dev)
- [Socket.IO Documentation](https://socket.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Ludo Rules Reference](https://en.wikipedia.org/wiki/Ludo)