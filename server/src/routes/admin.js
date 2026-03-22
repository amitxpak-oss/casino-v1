import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/create-subadmin', authenticate, authorize('SUPER_ADMIN'), adminController.createSubAdmin);
router.get('/stats', authenticate, authorize('SUB_ADMIN', 'SUPER_ADMIN'), adminController.getStats);

export default router;
