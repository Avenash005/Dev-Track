import { redisCache } from '../config/redis.js';

export const CACHE_TTL = {
  DASHBOARD_STATS: 300, // 5 minutes
  PROJECTS_LIST: 300,   // 5 minutes
  PROJECT_DETAILS: 300, // 5 minutes
  TASKS_LIST: 120,      // 2 minutes
  TASK_DETAILS: 120,    // 2 minutes
};

export const cacheKeys = {
  dashboardStats: (userId) => `devtrack:user:${userId}:dashboard:stats`,
  projectsList: (userId) => `devtrack:user:${userId}:projects:list`,
  projectDetails: (userId, projectId) => `devtrack:user:${userId}:projects:${projectId}`,
  tasksList: (userId, filters = {}) => {
    // Sort keys to ensure deterministic hash/cache key
    const sortedFilters = Object.keys(filters || {})
      .sort()
      .reduce((acc, key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          acc[key] = filters[key];
        }
        return acc;
      }, {});
    const querySlug = Object.keys(sortedFilters).length > 0 ? JSON.stringify(sortedFilters) : 'all';
    return `devtrack:user:${userId}:tasks:list:${querySlug}`;
  },
  taskDetails: (userId, taskId) => `devtrack:user:${userId}:tasks:${taskId}`,
};

export const cacheService = {
  /**
   * Invalidate all project-related caches and dashboard stats for a user
   */
  async invalidateProjectCaches(userId, projectId = null) {
    if (!userId) return;
    await Promise.all([
      redisCache.delPattern(`devtrack:user:${userId}:projects:*`),
      redisCache.del(cacheKeys.dashboardStats(userId)),
    ]);
  },

  /**
   * Invalidate all task-related caches, project lists (which contain task completion rates),
   * and dashboard stats for a user
   */
  async invalidateTaskCaches(userId, taskId = null) {
    if (!userId) return;
    await Promise.all([
      redisCache.delPattern(`devtrack:user:${userId}:tasks:*`),
      redisCache.delPattern(`devtrack:user:${userId}:projects:*`),
      redisCache.del(cacheKeys.dashboardStats(userId)),
    ]);
  },

  /**
   * Flush entire cache for a specific user
   */
  async flushUser(userId) {
    if (!userId) return;
    await redisCache.flushUser(userId);
  },
};

