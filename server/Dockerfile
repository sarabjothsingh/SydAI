# syntax=docker/dockerfile:1

# Build context must be project root to access ai_services
# Build: docker build -t sydai/backend:kind -f server/Dockerfile .

FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy dependency manifests
COPY server/package*.json ./

# Install production dependencies with clean cache
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY server/ .

# Copy required ai_services directory (external dependency)
COPY ai_services/ /ai_services/

# Set ownership to app user
RUN chown -R nodejs:nodejs /app /ai_services

# Switch to non-root user
USER nodejs

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
