import express from 'express';
import { getPublicSettings, updateSettings } from '../controllers/settingController.js';
import { protect } from '../middleware/auth.js';
import { cachePublicSettings, noStore } from '../middleware/cache.js';

const router = express.Router();

router.get('/', cachePublicSettings, getPublicSettings);
router.put('/admin', noStore, protect, updateSettings);

export default router;
