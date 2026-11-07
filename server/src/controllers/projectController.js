import { projectService } from '../services/projectService.js';
import { apiResponse } from '../utils/apiResponse.js';

export const projectController = {
  async getProjects(req, res, next) {
    try {
      const projects = await projectService.getProjects(req.user.id);
      return apiResponse.success(res, projects, 'Projects retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  async getProjectById(req, res, next) {
    try {
      const project = await projectService.getProjectById(req.user.id, req.params.id);
      return apiResponse.success(res, project, 'Project details retrieved successfully.');
    } catch (error) {
      next(error);
    }
  },

  async createProject(req, res, next) {
    try {
      const project = await projectService.createProject(req.user.id, req.body);
      return apiResponse.created(res, project, 'Project created successfully.');
    } catch (error) {
      next(error);
    }
  },

  async updateProject(req, res, next) {
    try {
      const project = await projectService.updateProject(req.user.id, req.params.id, req.body);
      return apiResponse.success(res, project, 'Project updated successfully.');
    } catch (error) {
      next(error);
    }
  },

  async deleteProject(req, res, next) {
    try {
      await projectService.deleteProject(req.user.id, req.params.id);
      return apiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  },
};
