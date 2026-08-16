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

const router = express.Router();

// Public routes
router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/:slug', getVehicleBySlug);
router.get('/:slug/similar', getSimilarVehicles);

// Admin protected routes
router.get('/admin/all', protect, getAdminVehicles);
router.post('/admin', protect, vehicleValidationRules, validateRequest, createVehicle);
router.put('/admin/:id', protect, vehicleValidationRules, validateRequest, updateVehicle);
router.delete('/admin/:id', protect, deleteVehicle);

export default router;
