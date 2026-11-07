import { dashboardService } from '../services/dashboardService.js';
import { apiResponse } from '../utils/apiResponse.js';
import { redisCache } from '../config/redis.js';
import { cacheKeys, CACHE_TTL } from '../services/cacheService.js';

export const dashboardController = {
  async getStats(req, res, next) {
    try {
      const cacheKey = cacheKeys.dashboardStats(req.user.id);

      // 1. Cache-Aside: Check Redis first
      const cached = await redisCache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return apiResponse.success(res, cached, 'Dashboard statistics retrieved from cache.');
      }

      // 2. Cache Miss: Fetch from database
      res.setHeader('X-Cache', 'MISS');
      const stats = await dashboardService.getStats(req.user.id);

      // 3. Populate Redis cache with TTL
      await redisCache.set(cacheKey, stats, CACHE_TTL.DASHBOARD_STATS);

      return apiResponse.success(res, stats, 'Dashboard statistics calculated successfully.');
    } catch (error) {
      next(error);
    }
  },

  async getActivity(req, res, next) {
    try {
      const activity = await dashboardService.getActivity(req.user.id);
      return apiResponse.success(res, activity, 'Activity history retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },
};
