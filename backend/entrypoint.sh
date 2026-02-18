#!/bin/sh
echo "🚀 Starting deployment script..."

echo "⚡️ Running Prisma Migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed."

echo "🔥 Starting NestJS Application..."
ls -la
ls -la dist || echo "dist not found"
exec node dist/main.js
