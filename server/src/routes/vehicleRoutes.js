import express from 'express';
import {
  getVehicles,
  getFeaturedVehicles,
  getVehicleBySlug,
  getSimilarVehicles,
  getAdminVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController.js';
import { protect } from '../middleware/auth.js';
import { vehicleValidationRules, validateRequest } from '../middleware/validators.js';
import { cachePublicData } from '../middleware/cache.js';

const router = express.Router();

// Public collection routes
router.get('/', cachePublicData, getVehicles);
router.get('/featured', cachePublicData, getFeaturedVehicles);

// Admin protected routes
router.get('/admin/all', protect, getAdminVehicles);
router.post('/admin', protect, vehicleValidationRules, validateRequest, createVehicle);
router.put('/admin/:id', protect, vehicleValidationRules, validateRequest, updateVehicle);
router.delete('/admin/:id', protect, deleteVehicle);

// Public slug routes must follow fixed admin/featured paths.
router.get('/:slug/similar', cachePublicData, getSimilarVehicles);
router.get('/:slug', cachePublicData, getVehicleBySlug);

export default router;
