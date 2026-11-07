import { Router } from 'express';
import { projectController } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateProject } from '../middleware/validationMiddleware.js';

const router = Router();

// All project routes require valid JWT authentication
router.use(authenticateToken);

// GET /api/projects
router.get('/', projectController.getProjects);

// POST /api/projects
router.post('/', validateProject, projectController.createProject);

// GET /api/projects/:id
router.get('/:id', projectController.getProjectById);

// PUT /api/projects/:id
router.put('/:id', validateProject, projectController.updateProject);

// DELETE /api/projects/:id
router.delete('/:id', projectController.deleteProject);

export default router;
