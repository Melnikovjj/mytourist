#!/bin/sh
echo "🚀 Starting deployment script..."

echo "⚡️ Running Prisma Migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed."

echo "🔥 Starting NestJS Application..."

# Always run build to ensure dist exists in runtime
echo "⚠️ Running build to ensure dist exists..."
npm run build

echo "✅ Build completed. Checking dist..."
ls -la dist

exec node dist/main.js
