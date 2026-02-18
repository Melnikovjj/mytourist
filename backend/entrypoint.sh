#!/bin/sh
echo "🚀 Starting deployment script..."

echo "⚡️ Running Prisma Migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed."

echo "🔥 Starting NestJS Application..."

if [ ! -d "dist" ]; then
  echo "⚠️ 'dist' directory not found. Running build..."
  npm run build
fi

exec node dist/main.js
