import express from 'express';
import { registerUser,loginUser ,logoutUser} from '../controller/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { addContact, searchUser } from '../controller/searchUser.js';
import { getUserData } from '../controller/userData.js';

import { getMessages, sendMessage, getUserConversations  } from '../controller/chatController.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login',loginUser)
router.post('/logout', logoutUser);
router.get('/search', verifyToken, searchUser)
router.post('/add-contact', verifyToken, addContact)
router.get('/user-data',verifyToken,getUserData)

// router.get('/refresh-token',refreshToken)


router.post('/send-message', verifyToken, sendMessage)
router.post('/messages', verifyToken, getMessages)
router.post('/conversation', verifyToken, getUserConversations)



export default router;
