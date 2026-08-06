# ============================================
# Web Dockerfile (Multi-stage build)
# ============================================

# Base image
FROM node:20-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/

# Install dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter @ludo-nexus/web...

# ============================================
# Development stage
# ============================================
FROM base AS development

WORKDIR /app

# Copy source code
COPY . .

EXPOSE 3000

CMD ["pnpm", "--filter", "@ludo-nexus/web", "run", "dev"]

# ============================================
# Builder stage
# ============================================
FROM base AS builder

WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN pnpm --filter @ludo-nexus/web run build

# ============================================
# Production stage (Standalone)
# ============================================
FROM node:20-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

ENV NODE_ENV=production

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]