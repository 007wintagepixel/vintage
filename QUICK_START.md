# LUDO NEXUS - QUICK START COMMANDS
# Run these in order to start fixing the critical gaps

## 1️⃣ FIRST - CHECK API BUILD ERRORS
cd /Users/akash/ludo-nexus/apps/api && pnpm build 2>&1 | head -100

## 2️⃣ SECOND - FIND ALL WEBSOCKET TODOs
grep -n "TODO: Emit via WebSocket gateway" /Users/akash/ludo-nexus/apps/api/src/game/game.service.ts

## 3️⃣ THIRD - START GAME PAGE COMPONENTIZATION
mkdir -p /Users/akash/ludo-nexus/apps/web/src/app/game/[matchId]/components

## 4️⃣ FOURTH - VIEW THE 39KB MONOLITH TO SPLIT
wc -l /Users/akash/ludo-nexus/apps/web/src/app/game/[matchId]/page.tsx

## 5️⃣ FIFTH - CHECK ADMIN FOLDER (EMPTY)
ls -la /Users/akash/ludo-nexus/apps/admin/

## 6️⃣ SIXTH - CHECK MOBILE STRUCTURE
ls -la /Users/akash/ludo-nexus/apps/mobile/lib/

## 7️⃣ SEVENTH - RUN FULL BUILD TO SEE ALL ERRORS
cd /Users/akash/ludo-nexus && pnpm build 2>&1 | tail -100

## 8️⃣ EIGHTH - VERIFY CURRENT STATUS
cd /Users/akash/ludo-nexus && git status --short | grep -v node_modules | head -50