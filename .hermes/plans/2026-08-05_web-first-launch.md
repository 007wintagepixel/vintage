# Ludo Nexus — Web-First Launch Plan (PWA + Capacitor)

> **Architecture:** Next.js 15 Web App → PWA → Capacitor → Android/iOS Native Apps
> **Backend:** NestJS + Prisma + PostgreSQL + Socket.IO (already built)

## Phase 1: Web App Core (Week 1-2)

### 1.1 Game Engine Integration ✅ DONE
- Game logic complete with 132 tests passing
- Shared types between web/API

### 1.2 Web Game Board (NEW)
- Canvas/SVG Ludo board with animations
- Real-time Socket.IO integration
- Touch + mouse support
- Responsive: 320px - 4K+

### 1.3 Auth Pages ✅ DONE
- Login, Register, Forgot Password, Reset Password
- JWT + refresh tokens
- Email/phone verification flow

### 1.4 Dashboard Pages
- Profile, Wallet, Match History, Friends, Tournaments

## Phase 2: PWA Configuration (Week 2)

### 2.1 PWA Manifest & Service Worker
- Offline support
- Install prompts
- Push notifications (Firebase)

### 2.2 Mobile Optimizations
- Touch gestures
- Viewport/safe areas
- Performance budgets

## Phase 3: Capacitor Native Builds (Week 3)

### 3.1 Capacitor Setup
- Android (Gradle)
- iOS (Xcode)
- Native plugins: Camera, Biometric, Push, Storage

### 3.2 Native Features
- Biometric auth (FaceID/TouchID)
- Local notifications
- Background sync
- Deep links

## Phase 4: Production Deploy (Week 3-4)

### 4.1 CI/CD Pipeline
- Web: Vercel/Netlify
- Android: Play Store (internal → production)
- iOS: TestFlight → App Store

### 4.2 Monitoring
- Sentry (errors)
- Analytics
- Uptime

---

## Immediate Next Steps (Tonight)

1. **Web Game Board** - Canvas Ludo board with real-time sync
2. **Dashboard Pages** - Profile, Wallet, Matches, Friends, Tournaments
3. **PWA Config** - Manifest, Service Worker, Icons
4. **Capacitor Init** - Android + iOS projects

Let me start executing now!