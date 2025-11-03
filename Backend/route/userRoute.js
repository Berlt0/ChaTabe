import express from 'express';
import { registerUser,loginUser ,logoutUser} from '../controller/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login',loginUser)
router.post('/logout', logoutUser);


export default router;
