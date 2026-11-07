import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateTask } from '../middleware/validationMiddleware.js';

const router = Router();

// All task routes require valid JWT authentication
router.use(authenticateToken);

// GET /api/tasks
router.get('/', taskController.getTasks);

// POST /api/tasks
router.post('/', validateTask, taskController.createTask);

// GET /api/tasks/:id
router.get('/:id', taskController.getTaskById);

// PUT /api/tasks/:id
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', taskController.deleteTask);

export default router;
