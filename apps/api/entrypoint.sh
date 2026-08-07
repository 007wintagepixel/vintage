#!/bin/sh
# Entrypoint: run Prisma migrations, then start the app
set -e

echo "Running Prisma migrations..."
./node_modules/.bin/prisma migrate deploy --schema=prisma/schema.prisma

echo "Starting NestJS application..."
exec node dist/main.js