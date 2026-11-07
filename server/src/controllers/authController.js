import { authService } from '../services/authService.js';
import { apiResponse } from '../utils/apiResponse.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      return apiResponse.created(res, result, 'User registered successfully.');
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return apiResponse.success(res, result, 'Login successful.');
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return apiResponse.success(res, user, 'Authenticated user profile retrieved.');
    } catch (error) {
      next(error);
    }
  },
};
