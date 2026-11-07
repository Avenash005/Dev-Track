import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateChat } from '../middleware/validationMiddleware.js';

const router = Router();

router.use(authenticateToken);

// POST /api/ai/chat
router.post('/chat', validateChat, aiController.chat);

// GET /api/ai/conversations
router.get('/conversations', aiController.getConversations);

// GET /api/ai/conversations/:id
router.get('/conversations/:id', aiController.getConversationById);

// DELETE /api/ai/conversations/:id
router.delete('/conversations/:id', aiController.deleteConversation);

export default router;
