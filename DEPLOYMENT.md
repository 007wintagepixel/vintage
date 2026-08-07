# Ludo Nexus — Deployment Guide

This guide walks you through deploying Ludo Nexus to the web. After deployment, you'll get a URL you can share with friends to play Ludo together.

## Prerequisites

- A GitHub account (free)
- Your code pushed to a GitHub repository

## Architecture

- **Web (Next.js)** → Vercel (free tier)
- **API (NestJS)** → Render (free tier, Docker runtime)
- **Database (PostgreSQL)** → Render (free database)
- **Redis** → Render (free database, for Socket.IO adapter)

---

## Step 1: Push to GitHub (2 min)

```bash
cd /Users/akash/ludo-nexus

git add .
git commit -m "feat: switch API deploy target to Render + Vercel"
git push origin main
```

---

## Step 2: Deploy API + Database to Render (10 min)

### Option A: Blueprint (one-click deploy)

1. Go to https://dashboard.render.com/blueprints
2. Click **New Blueprint Instance**
3. Select your `ludo-nexus` (007wintagepixel/vintage) repository
4. Render reads `render.yaml` automatically — it creates:
   - PostgreSQL database (ludo-nexus-db)
   - Redis database (ludo-nexus-redis)
   - Web service (ludo-nexus-api, Docker runtime)
5. Set the two secret env vars when prompted:
   - `JWT_SECRET` — run `openssl rand -base64 32` locally, paste here
   - `JWT_REFRESH_SECRET` — run `openssl rand -base64 32` again, paste here
6. Click **Apply**
7. Render builds the Docker image, runs prisma migrations, and starts the API

### Option B: Manual setup

1. Go to https://render.com and sign up with GitHub
2. Create a **PostgreSQL** database:
   - Name: `ludo-nexus-db`
   - Plan: Free
   - Region: Singapore (closest to India)
3. Create a **Redis** database:
   - Name: `ludo-nexus-redis`
   - Plan: Free
4. Create a **Web Service**:
   - Connect your `ludo-nexus` repo
   - Name: `ludo-nexus-api`
   - Runtime: **Docker**
   - Dockerfile Path: `apps/api/Dockerfile`
   - Docker Context: root (`.`)
   - Plan: Free
   - Health Check Path: `/health`
5. Add environment variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | (from Render PostgreSQL, copy Internal Connection String) |
| `REDIS_URL` | (from Render Redis, copy Connection String) |
| `JWT_SECRET` | Run `openssl rand -base64 32`, paste result |
| `JWT_REFRESH_SECRET` | Run `openssl rand -base64 32` again, paste result |
| `CORS_ORIGIN` | `https://your-app.vercel.app` (fill after Step 3) |
| `FRONTEND_URL` | `https://your-app.vercel.app` (fill after Step 3) |
| `OTP_DEV_MODE` | `true` |

6. Set Pre-Deploy Command: `npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma`
7. Click **Create Web Service**

Render will build and start your API. You'll get a URL like `https://ludo-nexus-api.onrender.com`.

---

## Step 3: Deploy Web to Vercel (5 min)

1. Go to https://vercel.com and sign up with GitHub
2. Click **Add New** → **Project**
3. Import your `ludo-nexus` (007wintagepixel/vintage) repository
4. Vercel auto-detects Next.js. Set these:
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && pnpm install --frozen-lockfile && pnpm run build --filter=web`
   - **Output Directory:** `apps/web/.next`
5. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com` (from Step 2) |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-api.onrender.com` (same as above) |

6. Click **Deploy**

Vercel will build and deploy. You'll get a URL like `https://ludo-nexus.vercel.app`.

---

## Step 4: Connect API to Web (2 min)

1. Go back to Render → your API service → Environment
2. Update `CORS_ORIGIN` to your Vercel URL: `https://ludo-nexus.vercel.app`
3. Update `FRONTEND_URL` to your Vercel URL: `https://ludo-nexus.vercel.app`
4. Render will auto-redeploy

---

## Step 5: Run Database Migrations (1 min)

If you used the Blueprint or set the pre-deploy command, migrations run automatically on each deploy.

If not, use the Render Shell:

1. In Render, open your API service → click **Shell** tab
2. Run:
```bash
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma
npx prisma db seed --schema=apps/api/prisma/schema.prisma
```

This creates all database tables and seeds demo data.

---

## Step 6: Verify (2 min)

1. Open your Vercel URL in browser
2. You should see the Ludo Nexus landing page
3. Click "Get Started" → register an account
4. Go to "Play" → create a room → share the room code with a friend
5. Your friend opens the URL, registers, joins with the code
6. Start the game — play Ludo together in real-time!

---

## Post-Deployment

### Automatic Updates
Every time you push to `main`, both Vercel and Render auto-deploy. No manual action needed.

### Custom Domain (Optional)
- In Vercel: Settings → Domains → add your domain
- Update `CORS_ORIGIN` and `FRONTEND_URL` in Render to match

### Monitoring
- Vercel: vercel.com/dashboard → your project → Analytics
- Render: render.com → your service → Metrics tab
- API logs: Render → your service → Logs tab

### Render Free Tier Notes
- Free web services spin down after 15 min of inactivity — first request after spin-down takes ~30s to cold-start
- Free PostgreSQL expires after 90 days (save a backup before then)
- Free Redis expires after 30 days (game still works without Redis, just no multi-instance Socket.IO scaling)

---

## Troubleshooting

**API won't start:** Check Render logs. Common issue — `DATABASE_URL` not set or Prisma client not generated. The Dockerfile handles `prisma generate` in the builder stage.

**WebSocket not connecting:** Make sure `NEXT_PUBLIC_SOCKET_URL` points to your Render API URL (not localhost). Also verify `CORS_ORIGIN` on the API matches your Vercel URL.

**Database migration fails:** Run `npx prisma migrate reset --schema=apps/api/prisma/schema.prisma` in Render Shell (WARNING: this deletes all data).

**CORS errors:** Make sure `CORS_ORIGIN` in Render matches your Vercel URL exactly (including https://).

**Prisma migration path issue:** The Dockerfile copies prisma to both `/app/prisma` and `/app/apps/api/prisma`. If migrations fail, try: `npx prisma migrate deploy --schema=/app/apps/api/prisma/schema.prisma`

---

## Environment Variables Summary

### Render (API)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=<from Render PostgreSQL>
REDIS_URL=<from Render Redis>
JWT_SECRET=<random 32-char string>
JWT_REFRESH_SECRET=<random 32-char string>
CORS_ORIGIN=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app
OTP_DEV_MODE=true
```

### Vercel (Web)
```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-api.onrender.com
```

That's it — 20 minutes and you're live! 🎮
