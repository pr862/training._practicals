import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middleware/auth';
import * as playlistController from '../../controllers/admin/playlist';
import { uploadPlaylistImage } from '../../middleware/upload/generic';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.post('/', uploadPlaylistImage, playlistController.createPlaylist);
router.get('/', playlistController.getAllPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.put('/:id', uploadPlaylistImage, playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);

router.post('/:id/tracks/:trackId', playlistController.addTrackToPlaylist);
router.delete('/:id/tracks/:trackId', playlistController.removeTrackFromPlaylist);

export default router;

