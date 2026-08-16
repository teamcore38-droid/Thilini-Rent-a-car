import express from 'express';
import {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  logoutAdmin
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { loginValidationRules, validateRequest } from '../middleware/validators.js';

const router = express.Router();

router.post('/login', authLimiter, loginValidationRules, validateRequest, loginAdmin);
router.get('/me', protect, getAdminProfile);
router.put('/profile', protect, updateAdminProfile);
router.post('/logout', logoutAdmin);

export default router;
