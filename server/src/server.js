import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env, validateEnv } from './config/env.js';
import { connectDatabases } from './config/database.js';
import { initRedis, redisCache, cacheStats } from './config/redis.js';
import { initSocket, socketStats } from './config/socket.js';
import { loggingMiddleware } from './middleware/loggingMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { apiResponse } from './utils/apiResponse.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// SSR Renderer imports
import { ssrRenderer } from './ssr/renderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Startup environment validation
validateEnv();

const app = express();

// 2. CORS configuration (restricting to frontend origin)
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://localhost',
  'http://localhost:80',
  'http://127.0.0.1',
  'http://127.0.0.1:80',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not permitted by CORS policy.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body parsers with request payload limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Request logging middleware
app.use(loggingMiddleware);

// 5. Serve static files for SSR client hydration scripts
app.use(express.static(path.resolve(__dirname, '../public')));

// 6. Server-Side Rendered (SSR) Public Pages
app.get('/', ssrRenderer.renderLanding);
app.get('/explore', ssrRenderer.renderExplore);
app.get('/p/:id', ssrRenderer.renderProject);

// 7. System Health Check Endpoint
app.get('/api/health', (req, res) => {
  return apiResponse.success(
    res,
    {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      aiModel: env.OLLAMA_MODEL,
      aiUrl: env.OLLAMA_BASE_URL,
      ssrPages: ['/', '/explore', '/p/:id'],
      paymentGateway: 'Razorpay Test Mode',
      redisCache: {
        status: redisCache.isReady() ? 'connected' : 'offline (resilient cache-aside)',
        stats: cacheStats,
      },
      websocket: {
        status: 'operational',
        transports: ['websocket', 'polling'],
        stats: socketStats,
      },
    },
    'DevTrack AI API Server, SSR Engine & WebSocket Gateway is operational.'
  );
});

// Cache telemetry route
app.get('/api/cache/stats', (req, res) => {
  return apiResponse.success(
    res,
    {
      isRedisReady: redisCache.isReady(),
      redisUrl: env.REDIS_URL,
      stats: cacheStats,
    },
    'Cache telemetry retrieved.'
  );
});

// Socket.IO telemetry route
app.get('/api/socket/stats', (req, res) => {
  return apiResponse.success(
    res,
    socketStats,
    'Socket.IO telemetry retrieved.'
  );
});

// 8. Mount REST API Resource Routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payment', paymentRoutes);

// 9. Unknown Route 404 Handler
app.use((req, res) => {
  return apiResponse.notFound(res, `Cannot ${req.method} ${req.originalUrl} - Endpoint does not exist.`);
});

// 10. Centralized Error Handling Middleware
app.use(errorHandler);

// 11. Create HTTP Server & Bind Socket.IO
const httpServer = http.createServer(app);
const io = initSocket(httpServer);

// 12. Start Server
async function startServer() {
  await connectDatabases();
  await initRedis();

  const server = httpServer.listen(env.PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  DevTrack AI Express Server running on port ${env.PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
    console.log(`  SSR Public Landing Page: http://localhost:${env.PORT}/`);
    console.log(`  SSR Public Projects:     http://localhost:${env.PORT}/explore`);
    console.log(`  WebSocket Real-Time:     ws://localhost:${env.PORT} (Socket.IO)`);
    console.log(`  Health Check:            http://localhost:${env.PORT}/api/health`);
    console.log(`  Frontend SPA URL:        ${env.FRONTEND_URL}`);
    console.log(`======================================================\n`);
  });

  return server;
}

// Start execution
startServer().catch((err) => {
  console.error('[CRITICAL] Server startup failure:', err);
  process.exit(1);
});

export { app, httpServer, io };
export default app;
