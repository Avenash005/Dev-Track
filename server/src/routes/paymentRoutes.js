import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public: view available subscription plans
router.get('/plans', paymentController.getPlans);

// Protected routes (Require JWT Authentication)
router.use(authenticateToken);

// POST /api/payment/create-order
router.post('/create-order', paymentController.createOrder);

// POST /api/payment/verify
router.post('/verify', paymentController.verifyPayment);

// POST /api/payment/failure
router.post('/failure', paymentController.handleFailure);

// GET /api/payment/subscription
router.get('/subscription', paymentController.getSubscription);

export default router;

