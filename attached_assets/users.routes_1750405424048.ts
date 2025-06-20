import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'Secure user info endpoint', user: req.user });
});

// Admin-only test
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Only admins can see this' });
});

export default router;
