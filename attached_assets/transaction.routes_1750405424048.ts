import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware';
import {
  createTransaction,
  getAllTransactions,
  getUserTransactions
} from '../controllers/transaction.controller';

const router = Router();

// Business + Admin + Finance can create transactions
router.post('/', verifyToken, authorizeRoles('business', 'admin', 'finance'), createTransaction);

// Admin + Finance can view all
router.get('/', verifyToken, authorizeRoles('admin', 'finance'), getAllTransactions);

// Any logged in user can view their own
router.get('/my', verifyToken, getUserTransactions);

export default router;
