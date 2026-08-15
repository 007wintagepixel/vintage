# ============================================
# API Dockerfile (Multi-stage build)
# ============================================

# Base image
FROM node:22-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages/

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
RUN pnpm --filter @ludo-nexus/api... run build

# Copy prisma migration files for deploy step
COPY apps/api/prisma ./apps/api/prisma

# ============================================
# Production stage
# ============================================
FROM node:22-alpine AS production

# Install dumb-init for proper signal handling and openssl for Prisma
RUN apk add --no-cache dumb-init openssl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /app

# Preserve pnpm's workspace layout. The API's dependencies are linked from the
# root store and workspace packages, so the runtime needs all three locations.
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages ./packages

WORKDIR /app/apps/api
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma

# Copy entrypoint script
COPY --chown=nestjs:nodejs apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nestjs

EXPOSE 10000

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["./entrypoint.sh"]
