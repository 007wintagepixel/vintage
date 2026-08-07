# ============================================
# API Dockerfile (Multi-stage build)
# ============================================

# Base image
FROM node:20-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/

# Install dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter @ludo-nexus/api...

# ============================================
# Development stage
# ============================================
FROM base AS development

WORKDIR /app

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm --filter @ludo-nexus/api run db:generate

EXPOSE 3001

CMD ["pnpm", "--filter", "@ludo-nexus/api", "run", "start:dev"]

# ============================================
# Builder stage
# ============================================
FROM base AS builder

WORKDIR /app

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm --filter @ludo-nexus/api run db:generate

# Build the application
RUN pnpm --filter @ludo-nexus/api run build

# Copy prisma migration files for deploy step
COPY apps/api/prisma ./apps/api/prisma

# ============================================
# Production stage
# ============================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./apps/api/prisma

USER nestjs

EXPOSE 3001

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]