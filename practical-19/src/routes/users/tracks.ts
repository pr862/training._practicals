import { Router } from 'express';
import * as userController from '../../controllers/user/tracks';

const router = Router();

router.get('/', userController.fetchAllTracks);

export default router;

