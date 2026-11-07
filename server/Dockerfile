# ==============================================================================
# DevTrack AI — Backend Express API Production Dockerfile
# Base: Node.js 20 LTS Alpine (minimal footprint, secured non-root execution)
# ==============================================================================

FROM node:20-alpine

# Install OpenSSL, libc compatibility, and wget for Prisma engine and healthchecks
RUN apk add --no-cache openssl libc6-compat wget

WORKDIR /app

# Production environment
ENV NODE_ENV=production

# Copy dependency specifications first to leverage Docker layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies required for Prisma client generation)
RUN npm ci || npm install

# Generate platform-optimized Prisma Client for Linux (musl)
RUN npx prisma generate

# Copy application source code and SSR public hydration bundles
COPY src ./src/
COPY public ./public/

# Ensure persistent local fallback storage directory exists and set ownership to 'node' user
RUN mkdir -p /app/data && chown -R node:node /app

# Switch to non-root user for security best practices
USER node

# Expose Express application port
EXPOSE 5000

# Health check to monitor Express REST API endpoint
HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the Express server
CMD ["node", "src/server.js"]

