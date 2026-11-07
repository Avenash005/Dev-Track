import { apiResponse } from '../utils/apiResponse.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_PROJECT_STATUSES = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'];
const ALLOWED_TASK_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const ALLOWED_TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'Full name is required and cannot be blank.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return apiResponse.badRequest(res, 'User registration validation failed', errors);
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const errors = {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    return apiResponse.badRequest(res, 'Login validation failed', errors);
  }

  req.body.email = email.trim().toLowerCase();
  next();
}

export function validateProject(req, res, next) {
  const { title, description, status } = req.body || {};
  const errors = {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Project title is required.';
  } else if (title.trim().length > 100) {
    errors.title = 'Project title cannot exceed 100 characters.';
  }

  if (status && !ALLOWED_PROJECT_STATUSES.includes(status)) {
    errors.status = `Status must be one of: ${ALLOWED_PROJECT_STATUSES.join(', ')}`;
  }

  if (Object.keys(errors).length > 0) {
    return apiResponse.badRequest(res, 'Project validation failed', errors);
  }

  req.body.title = title.trim();
  if (description) req.body.description = description.trim();
  if (!req.body.status) req.body.status = 'PLANNING';

  next();
}

export function validateTask(req, res, next) {
  const { title, projectId, status, priority } = req.body || {};
  const errors = {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Task title is required.';
  }

  if (!projectId || typeof projectId !== 'string' || projectId.trim().length === 0) {
    errors.projectId = 'Associated projectId is required.';
  }

  if (status && !ALLOWED_TASK_STATUSES.includes(status)) {
    errors.status = `Status must be one of: ${ALLOWED_TASK_STATUSES.join(', ')}`;
  }

  if (priority && !ALLOWED_TASK_PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${ALLOWED_TASK_PRIORITIES.join(', ')}`;
  }

  if (Object.keys(errors).length > 0) {
    return apiResponse.badRequest(res, 'Task validation failed', errors);
  }

  req.body.title = title.trim();
  req.body.projectId = projectId.trim();
  if (!req.body.status) req.body.status = 'PENDING';
  if (!req.body.priority) req.body.priority = 'MEDIUM';

  next();
}

export function validateChat(req, res, next) {
  const { message } = req.body || {};

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return apiResponse.badRequest(res, 'AI message content cannot be empty.');
  }

  req.body.message = message.trim();
  next();
}
