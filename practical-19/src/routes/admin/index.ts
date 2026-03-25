import { Router } from 'express';
import usersRouter from './users';
import albumsRouter from './albums';
import artistsRouter from './artists';
import tracksRouter from './tracks';
import playlistsRouter from './playlists';

const router = Router();

router.use('/users', usersRouter);
router.use('/albums', albumsRouter);
router.use('/artists', artistsRouter);
router.use('/tracks', tracksRouter);
router.use('/playlists', playlistsRouter);

export default router;

