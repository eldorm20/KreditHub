import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware';
import {
  createCompanyProfile,
  getCompanyProfiles,
  updateCompanyProfile,
  deleteCompanyProfile,
} from '../controllers/company.controller';
import { uploadLogo } from '../middleware/upload.middleware';

const router = Router();

router.get('/', verifyToken, getCompanyProfiles);
router.post('/', verifyToken, authorizeRoles('admin'), uploadLogo.single('logo'), createCompanyProfile);
router.put('/:id', verifyToken, authorizeRoles('admin'), uploadLogo.single('logo'), updateCompanyProfile);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteCompanyProfile);

export default router;
