import express from 'express';
import { sendMessage, getMessages, getChatList, getUnreadCount } from '../controllers/chat.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', verifyToken, sendMessage);
router.get('/messages/:otherUserId', verifyToken, getMessages);
router.get('/list', verifyToken, getChatList);
router.get('/unread-count', verifyToken, getUnreadCount);

export default router;
