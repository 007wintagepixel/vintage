#!/bin/bash
# ============================================
# LUDO NEXUS - DEVELOPMENT AGENT EXECUTION COMMANDS
# Generated from Comprehensive Review Report
# Date: 2025-08-06
# Status: ~55% Complete - NOT PRODUCTION READY
# ============================================

echo "🚀 LUDO NEXUS - PRODUCTION READINESS EXECUTION PLAN"
echo "=================================================="
echo ""
echo "📊 CURRENT STATUS: ~55% Complete"
echo "🔴 CRITICAL: Admin Panel = 0%, API not built, WebSocket incomplete"
echo "🟡 HIGH: Game page 39KB monolith, Mobile 25%"
echo ""

# ============================================
# PHASE 1: CRITICAL - DO THIS FIRST (This Week)
# ============================================

echo "============================================"
echo "🔴 PHASE 1: CRITICAL BLOCKERS (Week 1)"
echo "============================================"
echo ""

echo "📋 STEP 1: Build API Server & Fix TypeScript Errors"
echo "------------------------------------------------------"
echo "cd /Users/akash/ludo-nexus/apps/api && pnpm build"
echo ""

echo "📋 STEP 2: Fix 5 WebSocket TODO Emissions in game.service.ts"
echo "--------------------------------------------------------------"
echo "# Files to edit: apps/api/src/game/game.service.ts"
echo "# Lines with TODO: ~200, 280, 350, 400"
echo "# Replace: // TODO: Emit via WebSocket gateway"
echo "# With: this.gameGateway.emitToMatch(matchId, 'event_name', data)"
echo ""

echo "📋 STEP 3: Componentize Game Page (39KB → 7 Components)"
echo "--------------------------------------------------------"
echo "# Source: apps/web/src/app/game/[matchId]/page.tsx (39KB, 830 lines)"
echo "# Create these components in apps/web/src/app/game/[matchId]/components/:"
echo "mkdir -p apps/web/src/app/game/[matchId]/components"
echo "# 1. Board.tsx - Board rendering & geometry"
echo "# 2. Token.tsx - Token component with animations"
echo "# 3. Dice.tsx - Dice component with rolling animation"
echo "# 4. PlayerHand.tsx - Player token selection"
echo "# 4. Sidebar.tsx - Chat, player panels, status"
echo "# 5. Chat.tsx - Match chat component"
echo "# 6. DiceRoll.tsx - Dice roll button"
echo "# 7. GamePage.tsx - Main orchestrator (< 5KB)"
echo ""

echo "📋 STEP 4: Add Error Boundaries to Game Page"
echo "---------------------------------------------"
echo "# Create: apps/web/src/components/ErrorBoundary.tsx"
echo "# Wrap game page components"
echo ""

echo "📋 STEP 5: Add Reconnection UX"
echo "-------------------------------"
echo "# Visual indicators, sync progress, user feedback"
echo "# File: apps/web/src/app/game/[matchId]/page.tsx"
echo ""

# ============================================
# PHASE 2: HIGH PRIORITY (Week 2)
# ============================================

echo "============================================"
echo "🟡 PHASE 2: HIGH PRIORITY (Week 2)"
echo "============================================"
echo ""

echo "📋 STEP 6: Build Admin Panel (EMPTY FOLDER)"
echo "--------------------------------------------"
echo "# Initialize Next.js app in apps/admin/"
echo "cd /Users/akash/ludo-nexus/apps/admin && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias @/* --use-pnpm"
echo "# Add: Dashboard, User Management, Match Management, Tournament Management"
echo ""

echo "📋 STEP 7: Mobile Game UI (Flutter Canvas)"
echo "-------------------------------------------"
echo "# Create: apps/mobile/lib/ui/game/board.dart"
echo "# Create: apps/mobile/lib/ui/game/token.dart"
echo "# Create: apps/mobile/lib/ui/game/dice.dart"
echo "# Add to pubspec.yaml: flame, socket_io_client, provider"
echo ""

echo "📋 STEP 8: Bot Difficulty Config (Not Hardcoded)"
echo "-------------------------------------------------"
echo "# File: packages/game-engine/src/bot/botAI.ts"
echo "# Expose weights via config/env variables"
echo ""

# ============================================
# PHASE 3: MEDIUM PRIORITY (Week 3-4)
# ============================================

echo "============================================"
echo "🟢 PHASE 3: MEDIUM PRIORITY (Week 3-4)"
echo "============================================"
echo ""

echo "📋 STEP 9: Mobile Game Logic"
echo "-----------------------------"
echo "# Port game-engine to Flutter or use FFI"
echo "# Create: apps/mobile/lib/core/game/"
echo ""

echo "📋 STEP 10: Mobile Build Config (eas.json)"
echo "-------------------------------------------"
echo "# Create: apps/mobile/eas.json"
echo "# Create: apps/mobile/app.json"
echo "# Configure for iOS/Android store builds"
echo ""

echo "📋 STEP 11: Error Boundaries Testing"
echo "-------------------------------------"
echo "# Test React error boundaries"
echo "# File: packages/game-engine/src/bot/botAI.ts"
echo ""

echo "📋 STEP 12: Expo Store Builds"
echo "------------------------------"
echo "# Run: cd apps/mobile && eas build --platform all"
echo ""

# ============================================
# VERIFICATION COMMANDS
# ============================================

echo "============================================"
echo "✅ VERIFICATION CHECKLIST"
echo "============================================"
echo ""

echo "# 1. Verify API Build"
echo "cd /Users/akash/ludo-nexus && pnpm build:api"
echo "ls -la apps/api/dist/  # Should have compiled JS files"
echo ""

echo "# 2. Verify WebSocket Events"
echo "grep -r 'emitToMatch' apps/api/src/game/game.service.ts"
echo "# Should show NO '// TODO: Emit via WebSocket gateway' comments"
echo ""

echo "# 3. Verify Game Page Componentization"
echo "wc -l apps/web/src/app/game/[matchId]/page.tsx"
echo "# Should be < 100 lines (was 830)"
echo "ls apps/web/src/app/game/[matchId]/components/"
echo "# Should show: Board.tsx Token.tsx Dice.tsx PlayerHand.tsx Sidebar.tsx Chat.tsx DiceRoll.tsx"
echo ""

echo "# 4. Verify Admin Panel"
echo "ls -la apps/admin/src/"
echo "# Should show: app/, components/, lib/, etc."
echo ""

echo "# 5. Verify Mobile Game UI"
echo "ls -la apps/mobile/lib/ui/game/"
echo "# Should show: board.dart, token.dart, dice.dart"
echo ""

echo "# 6. Verify Mobile Build Config"
echo "ls -la apps/mobile/eas.json apps/mobile/app.json"
echo ""

echo "# 7. Full Build Test"
echo "cd /Users/akash/ludo-nexus && pnpm build"
echo "# All apps should build successfully"
echo ""

echo "# 8. E2E Test (2+ players)"
echo "cd /Users/akash/ludo-nexus/apps/web && npx playwright test"
echo ""

# ============================================
# DAILY STANDUP TEMPLATE
# ============================================

echo "============================================"
echo "📝 DAILY STANDUP TEMPLATE"
echo "============================================"
echo ""
echo "Copy this to DEVELOPMENT_AGENT_COMMUNICATION.md each day:"
echo ""
cat << 'EOF'
### REPLY FROM DEVELOPMENT AGENT - [TIMESTAMP]
**Status:** [What you're working on]
**Progress:** [What's done since last check]
**Blockers:** [Any issues]
**Questions for Review Agent:** [If any]
**Next Steps:** [What you'll do next]
EOF
echo ""

# ============================================
# QUICK START - RUN THIS FIRST
# ============================================

echo "============================================"
echo "🚀 QUICK START - RUN THESE 3 COMMANDS NOW"
echo "============================================"
echo ""
echo "# 1. Build API & see errors"
echo "cd /Users/akash/ludo-nexus/apps/api && pnpm build 2>&1 | head -50"
echo ""
echo "# 2. Check WebSocket TODOs"
echo "grep -n 'TODO: Emit via WebSocket gateway' /Users/akash/ludo-nexus/apps/api/src/game/game.service.ts"
echo ""
echo "# 3. Start game page componentization"
echo "mkdir -p /Users/akash/ludo-nexus/apps/web/src/app/game/[matchId]/components"
echo "# Then extract Board component first from page.tsx"
echo ""

echo "============================================"
echo "📚 KEY REFERENCE FILES"
echo "============================================"
echo ""
echo "1. COMPREHENSIVE_REVIEW_REPORT.md - Full review with all gaps"
echo "2. TODO.md - Prioritized task list with file references"
echo "3. plan/ludo-nexus-implementation-plan.md - Updated with 14 new tasks"
echo "4. DEVELOPMENT_AGENT_COMMUNICATION.md - Communication channel"
echo ""

echo "============================================"
echo "⏰ MONITORING: Hourly cron job (Job ID: 0c034bf9bf45)"
echo "📅 Next report: ~09:11 AM IST"
echo "💕 Review Agent is watching - make progress!"
echo "============================================"