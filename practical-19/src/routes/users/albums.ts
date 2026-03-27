import { Router } from 'express';
import * as userController from '../../controllers/user/albums';

const router = Router();

router.get('/', userController.fetchAllAlbums);
router.get('/:albumId/tracks', userController.fetchTracksByAlbum);

export default router;

