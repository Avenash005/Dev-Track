import { taskService } from '../services/taskService.js';
import { apiResponse } from '../utils/apiResponse.js';
import { redisCache } from '../config/redis.js';
import { cacheKeys, cacheService, CACHE_TTL } from '../services/cacheService.js';
import { socketEvents } from '../config/socket.js';

export const taskController = {
  async getTasks(req, res, next) {
    try {
      const { status, priority, search, projectId } = req.query;
      const filters = { status, priority, search, projectId };
      const cacheKey = cacheKeys.tasksList(req.user.id, filters);

      // 1. Cache-Aside: Check Redis
      const cached = await redisCache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return apiResponse.success(res, cached, 'Tasks retrieved from cache.');
      }

      // 2. Cache Miss: Query Database
      res.setHeader('X-Cache', 'MISS');
      const tasks = await taskService.getTasks(req.user.id, filters);

      // 3. Populate Redis with TTL
      await redisCache.set(cacheKey, tasks, CACHE_TTL.TASKS_LIST);

      return apiResponse.success(res, tasks, 'Tasks retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const cacheKey = cacheKeys.taskDetails(req.user.id, req.params.id);

      // 1. Check Redis
      const cached = await redisCache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return apiResponse.success(res, cached, 'Task details retrieved from cache.');
      }

      // 2. Cache Miss: Query Database
      res.setHeader('X-Cache', 'MISS');
      const task = await taskService.getTaskById(req.user.id, req.params.id);

      // 3. Populate Redis with TTL
      await redisCache.set(cacheKey, task, CACHE_TTL.TASK_DETAILS);

      return apiResponse.success(res, task, 'Task details retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.user.id, req.body);

      // Invalidate relevant user task, project completion, and dashboard caches
      await cacheService.invalidateTaskCaches(req.user.id);

      // Real-time WebSocket emission to authenticated user room
      socketEvents.emitTaskCreated(req.user.id, task);
      socketEvents.emitDashboardUpdated(req.user.id);

      return apiResponse.created(res, task, 'Task created successfully.');
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req, res, next) {
    try {
      const isStatusChanged = req.body && Object.prototype.hasOwnProperty.call(req.body, 'status');
      const task = await taskService.updateTask(req.user.id, req.params.id, req.body);

      // Invalidate relevant user task, project completion, and dashboard caches
      await cacheService.invalidateTaskCaches(req.user.id, req.params.id);

      // Real-time WebSocket emissions
      socketEvents.emitTaskUpdated(req.user.id, task);
      if (isStatusChanged) {
        socketEvents.emitTaskStatusChanged(req.user.id, task);
      }
      socketEvents.emitDashboardUpdated(req.user.id);

      return apiResponse.success(res, task, 'Task updated successfully.');
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.user.id, req.params.id);

      // Invalidate relevant user task, project completion, and dashboard caches
      await cacheService.invalidateTaskCaches(req.user.id, req.params.id);

      // Real-time WebSocket emissions
      socketEvents.emitTaskDeleted(req.user.id, req.params.id);
      socketEvents.emitDashboardUpdated(req.user.id);

      return apiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  },
};
