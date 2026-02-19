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

# Remove dev dependencies to slim image
RUN npm prune --production && npx prisma generate

# Railway provides PORT env var dynamically
ENV PORT=3000
EXPOSE ${PORT}

# Start: run db push (safer for this workflow without local postgres) then start server
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/src/main"]
