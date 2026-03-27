import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../../middleware/auth';
import { uploadTrackFields } from '../../middleware/upload/generic';
import * as trackController from '../../controllers/admin/track';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.post('/', uploadTrackFields, trackController.createTrack);
router.put('/:id', uploadTrackFields, trackController.updateTrack);
router.get('/', trackController.getAllTracks);
router.get('/:id', trackController.getTrackById);
router.delete('/:id', trackController.deleteTrack);

export default router;

