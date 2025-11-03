import express from 'express';
import { registerUser,loginUser ,logoutUser} from '../controller/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getUserData } from '../data.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login',loginUser)
router.post('/logout', logoutUser);
router.get('/data', getUserData)



export default router;
