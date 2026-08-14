# Ludo Nexus - Playtesting Guide

## Overview
This guide provides everything needed to conduct effective playtesting of the Ludo Nexus platform.

## Test Accounts (Pre-seeded)

| Username | Password | Role | Coins | Level |
|----------|----------|------|-------|-------|
| `cyber_gamer_99` | `demo123` | Player | 10,000 | 16 |
| `dice_master` | `demo123` | Player | 10,000 | 8 |
| `ludo_king_2024` | `demo123` | Player | 10,000 | 22 |
| `token_tactician` | `demo123` | Player | 10,000 | 12 |
| `board_boss` | `demo123` | Player | 10,000 | 5 |
| `admin` | `admin123` | Admin | 100,000 | 100 |

## Test Scenarios

### Scenario 1: vs AI (Single Player)
**Objective:** Test AI difficulty levels and game flow
1. Login as `cyber_gamer_99` / `demo123`
2. Navigate to **Game Modes** → **vs AI**
3. Create match with:
   - Entry Fee: 100
   - Bot Difficulty: Easy/Medium/Hard
3. Play complete game
4. Verify: Dice rolls, token movement, captures, win detection

**Expected Results:**
- Game creates successfully
- AI makes valid moves within turn time
- Captures work correctly
- Win/loss recorded properly
- Coins awarded/deducted

---

### Scenario 2: vs Human (2 Players)
**Objective:** Test real-time multiplayer
1. Open **two browser windows/incognito tabs**
2. Login as `cyber_gamer_99` / `demo123` in first
3. Login as `dice_master` / `demo123` in second
4. Player 1: Create match → **vs Human**
5. Player 2: Join via match link or code
6. Play complete game

**Expected Results:**
- Real-time WebSocket sync
- Both players see same board state
- Turn transitions work
- Chat works between players
- Reconnection works if tab closed

---

### Scenario 3: Private Room (4 Players)
**Objective:** Test room creation, invites, custom rules
1. Login as `cyber_gamer_99`
2. Navigate to **Game Modes** → **Private Room**
3. Create room with:
   - Custom name
   - Max players: 4
   - Password protection
   - Custom rules (entry roll, blockade, etc.)
4. Share invite link with other test accounts
5. All join, host starts game

**Expected Results:**
- Room creates with code
- Invite links work
- Password protection works
- Custom rules applied
- Spectator slots available

---

### Scenario 4: Tournament (8+ Players)
**Objective:** Test bracket generation, check-in, prizes
1. Login as `admin` / `admin123`
2. Admin panel → **Tournaments** → Create Tournament
4. Configure:
   - Max participants: 16
   - Entry fee: 500
   - Prize breakdown: 1st 50%, 2nd 30%, 3rd 20%
6. Publish tournament
5. Multiple accounts register
6. Check-in phase
7. Admin generates bracket
8. Play matches

**Expected Results:**
- Bracket generates correctly
- Check-in works
- Matches create automatically
- Prizes distributed
- Leaderboard updates

---

### Scenario 5: Wallet & Transactions
**Objective:** Test demo coin economy
1. Login as any demo user
2. Navigate to **Wallet**
3. Check balance, transaction history
4. Navigate to **Withdrawals** (admin)
5. Approve/reject withdrawal

**Expected Results:**
- Balance shows correctly
- Transaction history accurate
- Entry fees locked during match
- Winnings credited after match
- Admin can approve/reject withdrawals

---

### Scenario 6: Reconnection & Edge Cases
**Objective:** Test robustness
1. Start a match
2. Close browser tab mid-game
3. Reopen and login
3. Should reconnect to match
4. Test: Close during opponent's turn
5. Test: Network disconnect simulation

**Expected Results:**
- Graceful reconnection
- Game state restored
- Turn timers resume
- No data loss

---

### Scenario 7: Admin Panel Operations
**Objective:** Test admin functionality
1. Login as `admin` / `admin123`
2. Navigate to **Admin Panel**
3. Test each section:
   - **Users**: Search, ban/unban, view details
   - **Matches**: View history, replay
   - **Tournaments**: Create, manage, brackets
   - **Transactions**: Approve withdrawals
   - **KYC**: Review submissions
   - **Fraud Alerts**: Investigate, resolve
   - **Audit Logs**: Filter, export
   - **Settings**: Update game config

**Expected Results:**
- All CRUD operations work
- Data accurate and consistent
- Actions logged in audit trail

---

## Bug Report Template

```markdown
## Bug Report

**Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Environment:**
- Browser: [Chrome/Firefox/Safari/Edge] Version: [xx]
- OS: [macOS/Windows/Linux/iOS/Android]
- Network: [WiFi/4G/5G]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
 
**Actual Behavior:**
 
**Screenshots/Video:**
[Attach if possible]

**Console Errors:**
[Paste from DevTools Console]

**Device Info:**
- User Agent: [Copy from devtools]
- Screen Resolution: 
```

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] API server running on port 3001
- [ ] Web app running on port 3000 (production mode)
- [ ] PostgreSQL running
- [ ] Demo accounts seeded
- [ ] Admin account seeded

### Per Scenario
- [ ] Scenario 1: vs AI (Easy)
- [ ] Scenario 1: vs AI (Medium)
- [ ] Scenario 1: vs AI (Hard)
- [ ] Scenario 2: vs Human (2 players)
- [ ] Scenario 3: Private Room (4 players)
- [ ] Scenario 4: Tournament (8+ players)
- [ ] Scenario 5: Wallet & Transactions
- [ ] Scenario 6: Reconnection
- [ ] Scenario 7: Admin Panel

### Post-Test
- [ ] All bugs documented
- [ ] Critical bugs prioritized
- [ ] Test results summarized
- [ ] Regression risks identified

---

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Page Load (Web) | < 2s |  |
| API Response | < 200ms |  |
| WebSocket Connect | < 500ms |  |
| Match Create | < 500ms |  |
| Move Latency | < 100ms |  |
| 100 Concurrent | No errors |  |
| 500 Concurrent | < 1s |  |

---

## Test Data Cleanup

After testing:
```bash
# Reset database (optional)
cd apps/api && pnpm db:push --force-reset && pnpm db:seed

# Or restore from backup
pg_restore -d ludonexus backup.dump
```

---

## Contacts

- **Technical Lead:** [Name]
- **QA Lead:** [Name]
- **DevOps:** [Name]

---

*Last Updated: 2026-08-11*
*Version: 1.0*