import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://localhost:5000'
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000'));

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Connect to Socket.IO server with JWT authentication
   * @param {string} token - JWT bearer token
   */
  connect(token) {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    if (!token) {
      return null;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log(`[SOCKET CLIENT] Connected successfully (ID: ${this.socket.id})`);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('[SOCKET CLIENT] Connection error:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SOCKET CLIENT] Disconnected:', reason);
    });

    // Re-register any queued listeners if reconnected
    for (const [event, handlers] of this.listeners.entries()) {
      for (const handler of handlers) {
        this.socket.on(event, handler);
      }
    }

    return this.socket;
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('[SOCKET CLIENT] Socket disconnected manually.');
    }
  }

  /**
   * Subscribe to a real-time event
   * @param {string} event - Event name (e.g. 'task:created')
   * @param {Function} callback - Event handler
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Unsubscribe from a real-time event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Emit an event to the server
   */
  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Check if currently connected
   */
  isConnected() {
    return Boolean(this.socket && this.socket.connected);
  }

  /**
   * Get raw socket instance
   */
  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
