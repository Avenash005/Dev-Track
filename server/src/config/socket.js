import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './env.js';

let io = null;

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

/**
 * Socket.IO Telemetry tracking
 */
export const socketStats = {
  activeConnections: 0,
  totalConnections: 0,
  eventsEmitted: 0,
  roomsCreated: 0,
};

/**
 * Initializes the Socket.IO server and binds authentication middleware
 * @param {import('http').Server} httpServer
 */
export function initSocket(httpServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not permitted by Socket.IO CORS.`));
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // Authentication Middleware: Verify JWT before accepting connection
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '') ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error('Authentication error: Bearer token is required.'));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.user = decoded; // { id, email, name }
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new Error('Authentication error: Token expired.'));
      }
      return next(new Error('Authentication error: Invalid token signature.'));
    }
  });

  // Socket Connection Lifecycle
  io.on('connection', (socket) => {
    socketStats.totalConnections++;
    socketStats.activeConnections++;

    const userId = socket.user.id;
    const userRoom = `user:${userId}`;

    // Join isolated user room
    socket.join(userRoom);
    socketStats.roomsCreated++;

    console.log(
      `[SOCKET] User connected: ${socket.user.email} (${userId}) | SocketID: ${socket.id} | Joined room: ${userRoom}`
    );

    // Ping / Heartbeat event from client
    socket.on('client:ping', (data) => {
      socket.emit('server:pong', {
        received: data,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', (reason) => {
      socketStats.activeConnections = Math.max(0, socketStats.activeConnections - 1);
      console.log(
        `[SOCKET] User disconnected: ${socket.user.email} (${userId}) | Reason: ${reason}`
      );
    });

    socket.on('error', (error) => {
      console.error(`[SOCKET] Error on socket ${socket.id}:`, error.message);
    });
  });

  return io;
}

/**
 * Access the active Socket.IO server instance
 */
export function getIO() {
  return io;
}

/**
 * Emits an event strictly to a specific user's isolated room
 * @param {string} userId - Target user ID
 * @param {string} event - Event name
 * @param {object} payload - Event payload
 */
export function emitToUser(userId, event, payload = {}) {
  if (!io) {
    return false;
  }

  socketStats.eventsEmitted++;
  const room = `user:${userId}`;
  const envelope = {
    event,
    data: payload,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(event, envelope);
  return true;
}

// ----------------------------------------------------
// Specific Real-Time Domain Event Helpers
// ----------------------------------------------------

export const socketEvents = {
  // Task Events
  emitTaskCreated(userId, task) {
    return emitToUser(userId, 'task:created', { task });
  },

  emitTaskUpdated(userId, task) {
    return emitToUser(userId, 'task:updated', { task });
  },

  emitTaskDeleted(userId, taskId) {
    return emitToUser(userId, 'task:deleted', { taskId });
  },

  emitTaskStatusChanged(userId, task) {
    return emitToUser(userId, 'task:status_changed', { task });
  },

  // Project Events
  emitProjectCreated(userId, project) {
    return emitToUser(userId, 'project:created', { project });
  },

  emitProjectUpdated(userId, project) {
    return emitToUser(userId, 'project:updated', { project });
  },

  emitProjectDeleted(userId, projectId) {
    return emitToUser(userId, 'project:deleted', { projectId });
  },

  // Dashboard Events
  emitDashboardUpdated(userId, stats = null) {
    return emitToUser(userId, 'dashboard:updated', { stats });
  },
};
