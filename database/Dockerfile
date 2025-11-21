# syntax=docker/dockerfile:1

# Build: docker build -t sydai/database:latest -f database/Dockerfile database/

FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies with clean cache
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY . .

# Set ownership to app user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

ENV NODE_ENV=production \
    PORT=4000

EXPOSE 4000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
