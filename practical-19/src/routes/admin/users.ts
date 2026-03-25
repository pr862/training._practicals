import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middleware/auth';
import { getAllUsers } from '../../controllers/admin/users';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/', getAllUsers);

export default router;

