FROM node:18-alpine

# Prisma needs openssl and libc6-compat on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (need devDeps for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build NestJS
RUN npm run build

# Debug: verify build output exists
RUN ls -la dist/ && echo "✅ dist/main.js exists:" && test -f dist/main.js && echo "YES" || echo "NO — checking alternatives:" && find dist -name "main.js" -type f

# Railway provides PORT env var dynamically
ENV PORT=3000
EXPOSE ${PORT}

# Start: run migrations then start server
# Use shell form so $PORT is expanded at runtime
CMD sh -c "npx prisma migrate deploy && node dist/main.js"
