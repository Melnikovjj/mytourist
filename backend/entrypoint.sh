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

# Find main.js (handles dist/main.js or dist/src/main.js)
MAIN_FILE=$(find dist -name "main.js" | head -n 1)

if [ -z "$MAIN_FILE" ]; then
  echo "❌ Error: main.js not found in dist!"
  exit 1
fi

echo "🚀 Starting $MAIN_FILE..."
exec node "$MAIN_FILE"
