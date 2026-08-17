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
import { cachePublicData, cacheVehicleDetails, noStore } from '../middleware/cache.js';

const router = express.Router();

// Public collection routes
router.get('/', cachePublicData, getVehicles);
router.get('/featured', cachePublicData, getFeaturedVehicles);

// Admin protected routes
router.get('/admin/all', noStore, protect, getAdminVehicles);
router.post('/admin', noStore, protect, vehicleValidationRules, validateRequest, createVehicle);
router.put('/admin/:id', noStore, protect, vehicleValidationRules, validateRequest, updateVehicle);
router.delete('/admin/:id', noStore, protect, deleteVehicle);

// Public slug routes must follow fixed admin/featured paths.
router.get('/similar', cacheVehicleDetails, getSimilarVehicles);
router.get('/:slug', cacheVehicleDetails, getVehicleBySlug);

export default router;
