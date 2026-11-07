import express from 'express';
import cors from 'cors';
import { env, validateEnv } from './config/env.js';
import { connectDatabases } from './config/database.js';
import { loggingMiddleware } from './middleware/loggingMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { apiResponse } from './utils/apiResponse.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// 1. Startup environment validation
validateEnv();

const app = express();

// 2. CORS configuration (restricting to frontend origin)
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
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

// 5. System Health Check Endpoint
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
    },
    'DevTrack AI API Server is operational.'
  );
});

// 6. Mount REST API Resource Routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// 7. Unknown Route 404 Handler
app.use((req, res) => {
  return apiResponse.notFound(res, `Cannot ${req.method} ${req.originalUrl} - Endpoint does not exist.`);
});

// 8. Centralized Error Handling Middleware
app.use(errorHandler);

// 9. Start Server
async function startServer() {
  await connectDatabases();

  const server = app.listen(env.PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  DevTrack AI Express Server running on port ${env.PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
    console.log(`  Health Check: http://localhost:${env.PORT}/api/health`);
    console.log(`  Frontend:    ${env.FRONTEND_URL}`);
    console.log(`======================================================\n`);
  });

  return server;
}

// Start execution
startServer().catch((err) => {
  console.error('[CRITICAL] Server startup failure:', err);
  process.exit(1);
});

export default app;
