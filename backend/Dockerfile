FROM node:18-alpine

# Install OpenSSL and libc6-compat for Prisma (required for Alpine)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies provided in package.json
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application with migrations
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
