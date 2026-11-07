import { dashboardService } from '../services/dashboardService.js';
import { apiResponse } from '../utils/apiResponse.js';

export const dashboardController = {
  async getStats(req, res, next) {
    try {
      const stats = await dashboardService.getStats(req.user.id);
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

