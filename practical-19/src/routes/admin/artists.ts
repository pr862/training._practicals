import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middleware/auth';
import * as artistController from '../../controllers/admin/artist';
import { uploadArtistImage } from '../../middleware/upload/generic';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.post('/', uploadArtistImage, artistController.createArtist);
router.get('/', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);
router.put('/:id', uploadArtistImage, artistController.updateArtist);
router.delete('/:id', artistController.deleteArtist);

export default router;

