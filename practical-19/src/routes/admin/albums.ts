import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middleware/auth';
import * as albumController from '../../controllers/admin/album';
import { uploadAlbumImage } from '../../middleware/upload/generic';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.post('/', uploadAlbumImage, albumController.createAlbum);
router.get('/', albumController.getAllAlbums);
router.get('/:id', albumController.getAlbumById);
router.put('/:id', uploadAlbumImage, albumController.updateAlbum);
router.delete('/:id', albumController.deleteAlbum);

router.post('/:albumId/tracks/:trackId', albumController.addTrackToAlbum);
router.delete('/:albumId/tracks/:trackId', albumController.removeTrackFromAlbum);

export default router;

