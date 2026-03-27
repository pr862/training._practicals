import { Router } from 'express';
import albumsRouter from './albums';
import artistsRouter from './artists';
import tracksRouter from './tracks';
import playlistsRouter from './playlists';
import favouritesRouter from './favourites';

const router = Router();

router.use('/albums', albumsRouter);
router.use('/artists', artistsRouter);
router.use('/tracks', tracksRouter);
router.use('/playlists', playlistsRouter);
router.use('/favourites', favouritesRouter);

export default router;
