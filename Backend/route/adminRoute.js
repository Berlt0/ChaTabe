import express from 'express';
import { verifyToken,adminOnly } from '../middleware/authMiddleware.js';
import { getTotalUsers } from '../controller/admin/getTotalUsers.js';
import { getTotalMessages } from '../controller/admin/getTotalMessages.js';
import { getTotalAdmins } from '../controller/admin/getTotalAdmins.js';
import { getActiveUsers } from '../controller/admin/getActiveUsers.js';
import { getMessagesToday } from '../controller/admin/getTotalMessagesToday.js';


const router = express.Router(); 

router.get('/total-users', verifyToken,adminOnly,getTotalUsers);
router.get('/total-messages', verifyToken,adminOnly,getTotalMessages);
router.get('/total-admins', verifyToken,adminOnly,getTotalAdmins);
router.get('/active-users', verifyToken,adminOnly,getActiveUsers);
router.get('/messages-today', verifyToken, adminOnly, getMessagesToday);

export default router;