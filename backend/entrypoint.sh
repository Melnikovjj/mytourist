#!/bin/sh
echo "🚀 Starting deployment script..."

echo "⚡️ Running Prisma Migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed."

echo "🔥 Starting NestJS Application..."
# Using exec to replace shell with node process to catch signals correctly
exec node dist/main.js
