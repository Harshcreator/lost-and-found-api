import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import * as controller from '../controllers/items.controller';
import { upload } from '../utils/imageUpload';

const router = Router();

router.post('/lost-items', authenticate, upload.single('image'), controller.reportLostItem);
router.get('/match-items', controller.matchItems);
// Add other required routes

export default router;