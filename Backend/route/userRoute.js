import express from 'express';
import { registerUser,loginUser ,logoutUser,refreshAccessToken} from '../controller/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { addContact, searchUser } from '../controller/searchUser.js';
import { getUserData } from '../controller/userData.js';
import { searchMessage } from '../controller/searchMessage.js';

import { getMessages, sendMessage, getUserConversations ,editMessage, deleteMessage } from '../controller/chatController.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login',loginUser)
router.post('/logout', logoutUser);
router.get('/search', verifyToken, searchUser)
router.post('/add-contact', verifyToken, addContact)
router.get('/user-data',verifyToken,getUserData)

router.post("/refresh-token",refreshAccessToken);


router.post('/send-message', verifyToken, sendMessage)
router.post('/messages', verifyToken, getMessages)
router.post('/conversation', verifyToken, getUserConversations)
router.put('/edit-message/:id', verifyToken,editMessage)
router.delete('/delete-message/:id', verifyToken,deleteMessage)

router.post('/search-message', verifyToken, searchMessage);



export default router;
