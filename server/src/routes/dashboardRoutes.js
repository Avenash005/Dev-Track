import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getStats);

// GET /api/dashboard/activity
router.get('/activity', dashboardController.getActivity);

export default router;
