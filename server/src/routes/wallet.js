import { Router } from 'express';
import { walletController } from '../controllers/walletController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, walletController.getBalance);
router.get('/transactions', authenticate, walletController.getTransactions);
router.post('/deposit', authenticate, walletController.deposit);
router.post('/transfer', authenticate, walletController.transferToMain);
router.post('/add', authenticate, authorize('SUB_ADMIN', 'SUPER_ADMIN'), walletController.addBalance);

export default router;
