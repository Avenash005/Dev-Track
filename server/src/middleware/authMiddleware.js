import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { apiResponse } from '../utils/apiResponse.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return apiResponse.unauthorized(res, 'Access denied. Authorization header is missing.');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return apiResponse.unauthorized(
      res,
      'Invalid authorization format. Format must be "Bearer <token>".'
    );
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // { id, email, name, iat, exp }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return apiResponse.unauthorized(res, 'Authentication token has expired. Please log in again.');
    }
    return apiResponse.unauthorized(res, 'Invalid authentication token signature.');
  }
}
