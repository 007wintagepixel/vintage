# Ludo Nexus — Web-First Launch Plan (PWA + Capacitor)

> **Architecture:** Next.js 15 Web App → PWA → Capacitor → Native Android/iOS Apps  
> **Backend:** NestJS + Prisma + PostgreSQL + Socket.IO (already built)  
> **Single Codebase:** Web → PWA → Native Apps via Capacitor

---

## Phase 1: PWA Foundation (Week 1)

### 1.1 PWA Manifest & Service Worker
- [ ] Create `public/manifest.json` with proper icons, shortcuts, categories
- [ ] Create `public/sw.js` service worker with Workbox for offline caching
- [ ] Add PWA meta tags to layout.tsx
- [ ] Configure next.config.js for PWA (next-pwa or custom)
- [ ] Generate all required icon sizes (72x72 to 512x512)

### 1.2 Offline Support
- [ ] Cache static assets (JS, CSS, fonts, images)
- [ ] Cache API responses for offline-first experience
- [ ] Add offline fallback page
- [ ] Implement background sync for game moves

### 1.3 Install Prompts
- [ ] Custom install prompt component
- [ ] Track install conversion analytics
- [ ] iOS Safari "Add to Home Screen" instructions modal

---

## Phase 2: Game Board Completion (Week 1-2)

### 2.1 Canvas/SVG Game Board
- [ ] Complete Ludo board rendering (Canvas or SVG)
- [ ] Token animations (move, capture, enter/home)
- [ ] Dice roll animation (3D CSS or Canvas)
- [ ] Touch + mouse support
- [ ] Responsive: 320px - 4K+

### 2.2 Real-time Sync
- [ ] Socket.IO connection management
- [ ] Optimistic UI updates + server reconciliation
- [ ] Reconnection with state recovery
- [ ] Spectator mode

### 2.3 Game UI
- [ ] Player panels (avatars, tokens, status)
- [ ] Dice roll button + animation
- [ ] Chat sidebar
- [ ] Game log / move history
- [ ] Winner celebration animation

---

## Phase 3: Dashboard Pages (Week 2)

### 3.1 Auth Flow (Already Done ✅)
- Login, Register, Forgot Password, Email/Phone Verification

### 3.2 Dashboard Pages
- [ ] Profile page (avatar, stats, referral code)
- [ ] Wallet page (balance, transactions, deposit/withdraw)
- [ ] Match history (replay, filters)
- [ ] Friends page (requests, online status, search)
- [ ] Tournaments page (brackets, registration, prizes)

---

## Phase 4: Capacitor Native Builds (Week 2-3)

### 4.1 Capacitor Setup
- [ ] Install @capacitor/core, @capacitor/cli, @capacitor/android, @capacitor/ios
- [ ] Run `npx cap init` and `npx cap add android ios`
- [ ] Configure capacitor.config.ts

### 4.2 Native Plugins
- [ ] @capacitor/camera (avatar upload)
- [ ] @capacitor/biometric (FaceID/TouchID login)
- [ ] @capacitor/push-notifications (Firebase FCM)
- [ ] @capacitor/local-notifications (game invites, turn alerts)
- [ ] @capacitor/storage (secure token storage)
- [ ] @capacitor/device (device info, UUID)
- [ ] @capacitor/share (invite links)
- [ ] @capacitor/haptics (game feedback)
- [ ] @capacitor/status-bar, @capacitor/splash-screen

### 4.3 Platform Config
- [ ] Android: build.gradle, AndroidManifest.xml, icons, splash
- [ ] iOS: Xcode project, Info.plist, icons, launch screen
- [ ] Deep links (game invites, auth callbacks)
- [ ] Background modes (notifications, background fetch)

---

## Phase 5: Production Deploy (Week 3-4)

### 5.1 CI/CD Pipeline
- [ ] GitHub Actions: lint, typecheck, test, build
- [ ] Web: Deploy to Vercel/Netlify with preview URLs
- [ ] Android: Build AAB → Upload to Play Console (internal → production)
- [ ] iOS: Build IPA → Upload to TestFlight → App Store

### 5.2 Monitoring & Analytics
- [ ] Sentry (error tracking)
- [ ] PostHog/Amplitude (product analytics)
- [ ] Uptime monitoring
- [ ] Performance monitoring (Web Vitals)

---

## Phase 6: Launch Checklist

### Pre-Launch
- [ ] Load testing (1000 concurrent WebSocket connections)
- [ ] Security audit (OWASP, JWT, rate limiting)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Legal pages (Terms, Privacy, Responsible Gaming)
- [ ] App Store listings (screenshots, descriptions, keywords)

### Launch
- [ ] Soft launch (TestFlight + Play Internal)
- [ ] Beta feedback iteration
- [ ] Public launch
- [ ] Post-launch monitoring

---

## Immediate Next Steps (Tonight)

1. **Add PWA support** to Next.js (manifest, SW, icons)
2. **Complete game board** page with canvas/SVG rendering
3. **Add Capacitor** for native builds
4. **Complete dashboard** pages
5. **Set up CI/CD** for web + native

---

## File Structure After Completion

```
/apps/web/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── icons/                 # All icon sizes
│   └── offline.html           # Offline fallback
├── src/
│   ├── app/
│   │   ├── game/[matchId]/    # Game board page (complete)
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── (auth)/            # Auth pages (done)
│   │   ├── layout.tsx         # + PWA meta tags
│   │   └── globals.css        # + PWA styles
│   ├── components/
│   │   ├── game/              # Board, Token, Dice, PlayerPanel
│   │   ├── ui/                # Reusable UI components
│   │   └── pwa/               # InstallPrompt, OfflineBanner
│   ├── lib/
│   │   ├── socket.ts          # Socket.IO client
│   │   ├── pwa.ts             # PWA utilities
│   │   └── auth-context.tsx   # Auth provider
│   └── hooks/
│       ├── useGame.ts         # Game state hook
│       └── usePWA.ts          # PWA hooks
├── capacitor.config.ts         # Capacitor config
├── android/                    # Android project (generated)
├── ios/                        # iOS project (generated)
└── next.config.js             # + PWA config
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse PWA Score | ≥ 90 |
| Lighthouse Performance | ≥ 90 |
| Bundle Size (gzipped) | < 200KB |
| Time to Interactive | < 3s |
| PWA Install Rate | > 15% |
| Crash-free Sessions | > 99.9% |
| Play Store Rating | ≥ 4.5 |
| App Store Rating | ≥ 4.5 |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| WebSocket scaling | Redis adapter + horizontal scaling from day 1 |
| Wallet sync issues | Comprehensive tests + idempotency keys |
| Capacitor plugin conflicts | Test each plugin in isolation |
| App Store rejection | Follow guidelines, test on real devices |
| Offline sync conflicts | Server-authoritative + conflict resolution |

---

*Plan created: 2026-08-05*  
*Target launch: 4 weeks*