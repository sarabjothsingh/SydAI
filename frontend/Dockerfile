# syntax=docker/dockerfile:1

# Build: docker build -t sydai/frontend:latest -f frontend/Dockerfile frontend/

FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_BASE_URL=https://sydai.local/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build production bundle
RUN npm run build

# Production stage
FROM nginx:1.27-alpine AS runner

# Create nginx user if not exists
RUN addgroup -g 101 -S nginx 2>/dev/null || true && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx 2>/dev/null || true

# Copy built assets
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Nginx runs as user nginx in alpine
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
