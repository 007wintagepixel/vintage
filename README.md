# Ludo Nexus

A premium multiplayer Ludo game with real-time gameplay, cyber-gaming theme, and web-first architecture.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secrets

# 3. Start PostgreSQL + Redis (requires Docker)
docker-compose up -d postgres redis

# 4. Run database migrations
cd apps/api && npx prisma migrate dev && npx prisma db seed

# 5. Start development servers
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

## Architecture

```
ludo-nexus/
├── apps/
│   ├── web/          # Next.js 15 — player-facing app + admin panel
│   ├── api/          # NestJS — REST API + WebSocket (Socket.IO)
│   ├── mobile/       # Flutter (scaffold only, not in active dev)
│   └── admin/        # Merged into web at /admin route
├── packages/
│   ├── game-engine/  # Pure TypeScript Ludo engine (132 tests, 94% coverage)
│   ├── shared-types/ # TypeScript types shared across apps
│   ├── validation/   # Zod validation schemas
│   ├── api-client/   # TanStack Query + Socket.IO client hooks
│   └── ui/           # Shared React components
├── docker-compose.yml
└── .env.example
```

## Tech Stack

- **Frontend:** Next.js 15, React 18, Tailwind CSS, Framer Motion
- **Backend:** NestJS, Prisma ORM, Socket.IO
- **Database:** PostgreSQL 15, Redis 7
- **Game Engine:** Pure TypeScript (server-authoritative)
- **Monorepo:** pnpm workspaces + Turborepo
- **Deploy:** Vercel (web) + Render (API + DB + Redis)

## Game Modes

- Play vs AI (Easy, Medium, Hard)
- Play vs Human (matchmaking)
- Group Match (create room, invite friends with code)
- Tournament (knockout brackets)

## Admin Panel

Access at `/admin` — manage users, matches, transactions, tournaments, and audit logs.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment to Vercel + Render.

## Demo Mode

All currency is in "Demo Coins" — no real money is involved. Real-money features are behind a feature flag (disabled by default).

## License

MIT