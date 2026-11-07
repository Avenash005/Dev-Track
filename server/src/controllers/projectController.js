import { projectService } from '../services/projectService.js';
import { apiResponse } from '../utils/apiResponse.js';
import { redisCache } from '../config/redis.js';
import { cacheKeys, cacheService, CACHE_TTL } from '../services/cacheService.js';
import { socketEvents } from '../config/socket.js';

export const projectController = {
  async getProjects(req, res, next) {
    try {
      const cacheKey = cacheKeys.projectsList(req.user.id);

      // 1. Cache-Aside: Check Redis
      const cached = await redisCache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return apiResponse.success(res, cached, 'Projects retrieved from cache.');
      }

      // 2. Cache Miss: Query Database
      res.setHeader('X-Cache', 'MISS');
      const projects = await projectService.getProjects(req.user.id);

      // 3. Populate Redis with TTL
      await redisCache.set(cacheKey, projects, CACHE_TTL.PROJECTS_LIST);

      return apiResponse.success(res, projects, 'Projects retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  async getProjectById(req, res, next) {
    try {
      const cacheKey = cacheKeys.projectDetails(req.user.id, req.params.id);

      // 1. Check Redis
      const cached = await redisCache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return apiResponse.success(res, cached, 'Project details retrieved from cache.');
      }

      // 2. Cache Miss: Query Database
      res.setHeader('X-Cache', 'MISS');
      const project = await projectService.getProjectById(req.user.id, req.params.id);

      // 3. Populate Redis with TTL
      await redisCache.set(cacheKey, project, CACHE_TTL.PROJECT_DETAILS);

      return apiResponse.success(res, project, 'Project details retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.user.id, req.body);

      // Invalidate relevant user project and dashboard caches
      await cacheService.invalidateProjectCaches(req.user.id);

      // Real-time WebSocket emission to authenticated user room
      socketEvents.emitProjectCreated(req.user.id, project);
      socketEvents.emitDashboardUpdated(req.user.id);

      return apiResponse.created(res, project, 'Project created successfully.');
    } catch (error) {
      next(error);
    }
  },

  async updateProject(req, res, next) {
    try {
      const project = await projectService.updateProject(req.user.id, req.params.id, req.body);

      // Invalidate relevant user project and dashboard caches
      await cacheService.invalidateProjectCaches(req.user.id, req.params.id);

      // Real-time WebSocket emissions
      socketEvents.emitProjectUpdated(req.user.id, project);
      socketEvents.emitDashboardUpdated(req.user.id);

      return apiResponse.success(res, project, 'Project updated successfully.');
    } catch (error) {
      next(error);
    }
  },

  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(req.user.id, req.params.id);

      // Invalidate relevant user project and dashboard caches
      await cacheService.invalidateProjectCaches(req.user.id, req.params.id);

      // Real-time WebSocket emissions
      socketEvents.emitProjectDeleted(req.user.id, req.params.id);
      socketEvents.emitDashboardUpdated(req.user.id);

      return apiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  },
};
