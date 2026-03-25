import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as userController from '../../controllers/user/favourites';

const router = Router();

router.post('/:trackId', authenticate, userController.favouriteTrack);
router.delete('/:trackId', authenticate, userController.unfavouriteTrack);
router.get('/:userId', authenticate, userController.getUserFavourites);

export default router;

