import { Router } from 'express';
import adminAuthRouter from './admin';
import userAuthRouter from './users';

const router = Router();

router.use('/admin', adminAuthRouter);
router.use('/user', userAuthRouter);

export default router;

