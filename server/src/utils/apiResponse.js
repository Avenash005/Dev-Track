export const apiResponse = {
  success(res, data = null, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  },

  created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  },

  noContent(res) {
    return res.status(204).send();
  },

  badRequest(res, message = 'Invalid request payload', errors = null) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message,
      errors,
    });
  },

  unauthorized(res, message = 'Authentication required or invalid token') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message,
    });
  },

  forbidden(res, message = 'You do not have permission to access this resource') {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message,
    });
  },

  notFound(res, message = 'Requested resource not found') {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message,
    });
  },

  conflict(res, message = 'Resource already exists or conflicting state') {
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message,
    });
  },

  error(res, message = 'Internal server error', statusCode = 500, details = null) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
    });
  },

  serviceUnavailable(res, message = 'External service currently unavailable') {
    return res.status(503).json({
      success: false,
      statusCode: 503,
      message,
    });
  },
};
