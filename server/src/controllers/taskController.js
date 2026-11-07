import { taskService } from '../services/taskService.js';
import { apiResponse } from '../utils/apiResponse.js';

export const taskController = {
  async getTasks(req, res, next) {
    try {
      const { status, priority, search, projectId } = req.query;
      const tasks = await taskService.getTasks(req.user.id, {
        status,
        priority,
        search,
        projectId,
      });
      return apiResponse.success(res, tasks, 'Tasks retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.user.id, req.params.id);
      return apiResponse.success(res, task, 'Task details retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.user.id, req.body);
      return apiResponse.created(res, task, 'Task created successfully.');
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
      return apiResponse.success(res, task, 'Task updated successfully.');
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.user.id, req.params.id);
      return apiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  },
};

