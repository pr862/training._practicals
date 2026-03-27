import { Router } from 'express';
import * as userController from '../../controllers/user/artists';

const router = Router();

router.get('/', userController.fetchAllArtists);
router.get('/:id', userController.getArtistById);
router.get('/:id/tracks', userController.getArtistTracks);
router.get('/:id/albums', userController.getArtistAlbums);

export default router;

