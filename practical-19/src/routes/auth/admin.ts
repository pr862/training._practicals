import { Router } from 'express';
import { adminRegister, adminLogin } from '../../controllers/auth/admin';

const router = Router();

router.post('/register', adminRegister);
router.post('/login', adminLogin);

export default router;

