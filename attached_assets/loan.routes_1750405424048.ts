import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware';
import {
  createLoanApplication,
  getAllLoanApplications,
  updateLoanStatus
} from '../controllers/loan.controller';

const router = Router();

// Business user submits a loan application
router.post('/', verifyToken, authorizeRoles('business'), createLoanApplication);

// Admin fetches all applications
router.get('/', verifyToken, authorizeRoles('admin'), getAllLoanApplications);

// Admin updates loan status (approve/reject)
router.patch('/:id', verifyToken, authorizeRoles('admin'), updateLoanStatus);

export default router;
