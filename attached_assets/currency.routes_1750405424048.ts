import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware';
import {
  getCurrencies,
  addCurrency,
  updateCurrency,
  triggerCurrencyUpdate,
} from '../controllers/currency.controller';

const router = Router();

// Anyone logged in can view currencies
router.get('/', verifyToken, getCurrencies);

// Only admin can add or update currencies
router.post('/update', verifyToken, authorizeRoles('admin'), triggerCurrencyUpdate);
router.post('/', verifyToken, authorizeRoles('admin'), addCurrency);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateCurrency);

export default router;
