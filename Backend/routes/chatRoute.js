import express from 'express';
import { createChat, createGroupChat, getMyChats, getChatMessages, joinGroupChat, leaveGroupChat } from '../controllers/chatController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/one-on-one', verifyJWT, createChat);
router.post('/group', verifyJWT, createGroupChat);
router.get('/my-chats', verifyJWT, getMyChats);
router.get('/:chatId/messages', verifyJWT, getChatMessages);
router.post('/join-group', verifyJWT, joinGroupChat);
router.post('/leave-group', verifyJWT, leaveGroupChat);

export default router;