import express from 'express';
import {
  getServices,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/contentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Services
router.get('/services', getServices);
router.get('/services/admin', protect, getAdminServices);
router.post('/services/admin', protect, createService);
router.put('/services/admin/:id', protect, updateService);
router.delete('/services/admin/:id', protect, deleteService);

// FAQs
router.get('/faqs', getFAQs);
router.get('/faqs/admin', protect, getAdminFAQs);
router.post('/faqs/admin', protect, createFAQ);
router.put('/faqs/admin/:id', protect, updateFAQ);
router.delete('/faqs/admin/:id', protect, deleteFAQ);

// Testimonials
router.get('/testimonials', getTestimonials);
router.get('/testimonials/admin', protect, getAdminTestimonials);
router.post('/testimonials/admin', protect, createTestimonial);
router.put('/testimonials/admin/:id', protect, updateTestimonial);
router.delete('/testimonials/admin/:id', protect, deleteTestimonial);

export default router;
