import { createClient } from 'redis';
import { env } from './env.js';

let redisClient = null;
let isRedisConnected = false;
let connectionAttempted = false;

// In-memory fallback cache (used when Redis server is offline or unreachable)
const fallbackMemoryCache = new Map();

// Cache telemetry statistics
export const cacheStats = {
  hits: 0,
  misses: 0,
  sets: 0,
  invalidations: 0,
  bypasses: 0,
};

/**
 * Initialize Redis connection safely with retry bounds.
 * Does NOT crash or block server startup if Redis is offline.
 */
export async function initRedis() {
  if (connectionAttempted) return redisClient;
  connectionAttempted = true;

  try {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        connectTimeout: 2500,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            // Stop aggressive retrying if Redis is not installed/running locally
            return false;
          }
          return Math.min(retries * 500, 2000);
        },
      },
    });

    redisClient.on('connect', () => {
      // socket connected
    });

    redisClient.on('ready', () => {
      isRedisConnected = true;
      console.log(`[REDIS] ✔ Connected to Redis at ${env.REDIS_URL}`);
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      // Only log concise warning rather than spamming stack traces
      if (!redisClient.__hasLoggedError) {
        console.warn(`[REDIS] ! Redis unreachable (${err.message || 'connection failed'}). Running in resilient Cache-Aside mode.`);
        redisClient.__hasLoggedError = true;
      }
    });

    redisClient.on('end', () => {
      isRedisConnected = false;
    });

    // Connect asynchronously to avoid blocking server boot
    redisClient.connect().catch((err) => {
      isRedisConnected = false;
    });
  } catch (err) {
    isRedisConnected = false;
    console.warn(`[REDIS] ! Redis initialization error: ${err.message}. Direct database querying active.`);
  }

  return redisClient;
}

export const redisCache = {
  /**
   * Check if live Redis server is connected and ready
   */
  isReady() {
    return isRedisConnected && redisClient && redisClient.isReady;
  },

  /**
   * Safe JSON cache retrieval
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async get(key) {
    if (this.isReady()) {
      try {
        const raw = await redisClient.get(key);
        if (raw !== null && raw !== undefined) {
          cacheStats.hits++;
          return JSON.parse(raw);
        }
      } catch (err) {
        console.warn(`[REDIS GET ERROR] Key: ${key} - ${err.message}`);
      }
    } else {
      // Memory fallback check
      const mem = fallbackMemoryCache.get(key);
      if (mem && mem.expiresAt > Date.now()) {
        cacheStats.hits++;
        return JSON.parse(mem.value);
      }
      fallbackMemoryCache.delete(key);
    }

    cacheStats.misses++;
    return null;
  },

  /**
   * Safe JSON cache store with TTL
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds Default: 300 (5 minutes)
   * @returns {Promise<boolean>}
   */
  async set(key, value, ttlSeconds = 300) {
    try {
      const serialized = JSON.stringify(value);

      if (this.isReady()) {
        if (ttlSeconds && ttlSeconds > 0) {
          await redisClient.set(key, serialized, { EX: ttlSeconds });
        } else {
          await redisClient.set(key, serialized);
        }
      } else {
        // Memory fallback store
        fallbackMemoryCache.set(key, {
          value: serialized,
          expiresAt: Date.now() + (ttlSeconds || 300) * 1000,
        });
      }

      cacheStats.sets++;
      return true;
    } catch (err) {
      console.warn(`[REDIS SET ERROR] Key: ${key} - ${err.message}`);
      return false;
    }
  },

  /**
   * Delete single cache key
   * @param {string} key
   */
  async del(key) {
    try {
      cacheStats.invalidations++;
      fallbackMemoryCache.delete(key);

      if (this.isReady()) {
        await redisClient.del(key);
      }
      return true;
    } catch (err) {
      console.warn(`[REDIS DEL ERROR] Key: ${key} - ${err.message}`);
      return false;
    }
  },

  /**
   * Invalidate multiple keys matching a pattern (e.g. 'devtrack:user:usr-1:*')
   * Uses SCAN iterator to avoid blocking the Redis event loop.
   * @param {string} pattern
   */
  async delPattern(pattern) {
    try {
      cacheStats.invalidations++;

      // Invalidate memory fallback entries matching pattern
      const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      for (const k of fallbackMemoryCache.keys()) {
        if (regexPattern.test(k)) {
          fallbackMemoryCache.delete(k);
        }
      }

      if (this.isReady()) {
        const keysToDelete = [];
        for await (const key of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
          keysToDelete.push(key);
        }
        if (keysToDelete.length > 0) {
          await redisClient.del(keysToDelete);
        }
      }
      return true;
    } catch (err) {
      console.warn(`[REDIS DEL PATTERN ERROR] Pattern: ${pattern} - ${err.message}`);
      return false;
    }
  },

  /**
   * Invalidate all cached data for a specific user
   * @param {string} userId
   */
  async flushUser(userId) {
    if (!userId) return;
    await this.delPattern(`devtrack:user:${userId}:*`);
  },

  /**
   * Clear all cache entries (test helper)
   */
  async flushAll() {
    fallbackMemoryCache.clear();
    if (this.isReady()) {
      try {
        await redisClient.flushDb();
      } catch {}
    }
  },

  /**
   * Get raw client instance
   */
  getClient() {
    return redisClient;
  },
};
