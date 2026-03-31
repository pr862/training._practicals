import { Router } from 'express';
import * as userController from '../../controllers/user/playlists';
import { addTrackToUserPlaylist, removeTrackFromUserPlaylist } from '../../controllers/user/playlistTracks';

const router = Router();

router.get('/', userController.fetchAllPlaylists);
router.get('/:id', userController.getPlaylistById);
router.post('/:id/tracks/:trackId', addTrackToUserPlaylist);
router.delete('/:id/tracks/:trackId', removeTrackFromUserPlaylist);

export default router;

