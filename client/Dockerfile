# ==============================================================================
# DevTrack AI — Frontend Production Multi-Stage Dockerfile
# Stage 1: Compile React 18 + Vite static bundle
# Stage 2: High-performance Nginx production web server
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies required for Vite production build
RUN npm ci || npm install

# Copy source code and configuration files
COPY . .

# Compile optimized static bundle to /app/dist
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Serve via Nginx
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runner

# Remove default Nginx welcome site
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (reverse proxy, SPA fallback, gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Health check to verify Nginx web server responsiveness
HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
