import { apiResponse } from '../utils/apiResponse.js';

export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] Uncaught exception at ${req.method} ${req.originalUrl}:`, err);

  // Syntax error from body-parser (e.g. malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return apiResponse.badRequest(res, 'Malformed JSON in request body payload.');
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return apiResponse.conflict(res, `A record with this ${target} already exists.`);
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    return apiResponse.notFound(res, 'The requested database record does not exist.');
  }

  // Default to 500 internal server error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error occurred.';

  return apiResponse.error(res, message, statusCode, err.stack);
}
