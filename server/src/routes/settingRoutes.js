import express from 'express';
import { getPublicSettings, updateSettings } from '../controllers/settingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPublicSettings);
router.put('/admin', protect, updateSettings);

export default router;
