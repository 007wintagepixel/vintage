# Ludo Nexus — Deployment Guide

This guide walks you through deploying Ludo Nexus to the web. After deployment, you'll get a URL you can share with friends to play Ludo together.

## Prerequisites

- A GitHub account (free)
- Your code pushed to a GitHub repository

## Architecture

- **Web (Next.js)** → Vercel (free tier)
- **API (NestJS)** → Railway (free tier)
- **Database (PostgreSQL)** → Railway (free addon)
- **Redis** → Railway (free addon, optional but recommended)

---

## Step 1: Push to GitHub (2 min)

```bash
cd /Users/akash/ludo-nexus

# Create a new GitHub repo (if not already)
gh repo create ludo-nexus --private --source=. --push

# Or if repo already exists:
git add .
git commit -m "Production ready: all pages built, API fixed, admin panel added"
git push origin main
```

---

## Step 2: Deploy API to Railway (10 min)

1. Go to https://railway.app and sign up with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `ludo-nexus` repository
4. Railway will detect the monorepo — set the root directory to `apps/api`
5. Add these addons:
   - **PostgreSQL** (click + → Database → PostgreSQL)
   - **Redis** (click + → Database → Redis)
6. Go to **Settings** → set the following environment variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `DATABASE_URL` | (auto-filled by Railway PostgreSQL addon) |
| `REDIS_URL` | (auto-filled by Railway Redis addon) |
| `JWT_SECRET` | Run `openssl rand -base64 32` in terminal, paste result |
| `JWT_REFRESH_SECRET` | Run `openssl rand -base64 32` again, paste result |
| `FRONTEND_URL` | `https://your-app.vercel.app` (fill after Step 3) |
| `OTP_DEV_MODE` | `true` |

7. Set Build Command: `cd ../.. && pnpm install --frozen-lockfile && pnpm run build --filter=api`
8. Set Start Command: `node apps/api/dist/main.js`
9. Click **Deploy**

Railway will build and start your API. You'll get a URL like `https://ludo-nexus-api.up.railway.app`.

---

## Step 3: Deploy Web to Vercel (5 min)

1. Go to https://vercel.com and sign up with GitHub
2. Click **Add New** → **Project**
3. Import your `ludo-nexus` repository
4. Vercel auto-detects Next.js. Set these:
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && pnpm install --frozen-lockfile && pnpm run build --filter=web`
   - **Output Directory:** `apps/web/.next`
5. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.up.railway.app` (from Step 2) |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-api.up.railway.app` (same as above) |

6. Click **Deploy**

Vercel will build and deploy. You'll get a URL like `https://ludo-nexus.vercel.app`.

---

## Step 4: Connect API to Web (2 min)

1. Go back to Railway → your API project → Variables
2. Update `FRONTEND_URL` to your Vercel URL: `https://ludo-nexus.vercel.app`
3. Railway will auto-redeploy

---

## Step 5: Run Database Migrations (1 min)

1. In Railway, open your API project
2. Go to the **Console** tab (or use the Railway CLI)
3. Run:
```bash
npx prisma migrate deploy
npx prisma db seed
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
Every time you push to `main`, both Vercel and Railway auto-deploy. No manual action needed.

### Custom Domain (Optional)
- In Vercel: Settings → Domains → add your domain
- Update `FRONTEND_URL` in Railway to match

### Monitoring
- Vercel: vercel.com/dashboard → your project → Analytics
- Railway: railway.app → your project → Metrics tab
- API logs: Railway → your project → Deploy Logs

---

## Troubleshooting

**API won't start:** Check Railway logs. Common issue — `DATABASE_URL` not set or Prisma client not generated. Add `npx prisma generate` to the build command.

**WebSocket not connecting:** Make sure `NEXT_PUBLIC_SOCKET_URL` points to your Railway API URL (not localhost).

**Database migration fails:** Run `npx prisma migrate reset` in Railway console (WARNING: this deletes all data).

**CORS errors:** Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly (including https://).

---

## Environment Variables Summary

### Railway (API)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=<from Railway PostgreSQL>
REDIS_URL=<from Railway Redis>
JWT_SECRET=<random 32-char string>
JWT_REFRESH_SECRET=<random 32-char string>
FRONTEND_URL=https://your-app.vercel.app
OTP_DEV_MODE=true
```

### Vercel (Web)
```
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-api.up.railway.app
```

That's it — 20 minutes and you're live! 🎮