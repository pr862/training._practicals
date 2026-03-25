import { Router } from 'express';
import * as userController from '../../controllers/user/playlists';
import { addTrackToUserPlaylist, removeTrackFromUserPlaylist } from '../../controllers/user/playlistTracks';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', userController.fetchAllPlaylists);
router.get('/:id', userController.getPlaylistById);
router.post('/:id/tracks/:trackId', authenticate, addTrackToUserPlaylist);
router.delete('/:id/tracks/:trackId', authenticate, removeTrackFromUserPlaylist);

export default router;

