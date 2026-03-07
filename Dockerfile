# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies (package-lock.json for reproducible installs)
COPY package.json package-lock.json* ./
RUN npm ci

# Schema and source
COPY tsconfig*.json ./
COPY nest-cli.json* ./
COPY src ./src

# Generate Prisma client and build NestJS
RUN npm run build

# Remove devDependencies for production copy
RUN npm prune --production

# Production stage
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

# Production node_modules from builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# Built app and Prisma client (imports use ../generated/prisma from dist/src/prisma)
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/src/generated ./dist/generated

USER nestjs

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "dist/main.js"]
