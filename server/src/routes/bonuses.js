import { Router } from 'express';
import { bonusController } from '../controllers/bonusController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, bonusController.getAll);
router.get('/my', authenticate, bonusController.getMyBonuses);
router.post('/validate', authenticate, bonusController.validateCode);
router.post('/claim', authenticate, bonusController.claimBonus);
router.get('/referral', authenticate, bonusController.getReferralStats);

// Admin routes
router.post('/', authenticate, authorize('SUPER_ADMIN'), bonusController.create);

export default router;
