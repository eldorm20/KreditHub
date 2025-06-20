import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { sendMessage, getMessagesWithUser } from '../controllers/message.controller';

const router = Router();

// Send a message to a user
router.post('/', verifyToken, sendMessage);

// Get conversation with a user
router.get('/:userId', verifyToken, getMessagesWithUser);

export default router;
