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
  deleteTestimonial,
  getHomeContent
} from '../controllers/contentController.js';
import { protect } from '../middleware/auth.js';
import { cachePublicData, noStore } from '../middleware/cache.js';

const router = express.Router();

// Homepage payload
router.get('/home', cachePublicData, getHomeContent);

// Services
router.get('/services', cachePublicData, getServices);
router.get('/services/admin', noStore, protect, getAdminServices);
router.post('/services/admin', noStore, protect, createService);
router.put('/services/admin/:id', noStore, protect, updateService);
router.delete('/services/admin/:id', noStore, protect, deleteService);

// FAQs
router.get('/faqs', cachePublicData, getFAQs);
router.get('/faqs/admin', noStore, protect, getAdminFAQs);
router.post('/faqs/admin', noStore, protect, createFAQ);
router.put('/faqs/admin/:id', noStore, protect, updateFAQ);
router.delete('/faqs/admin/:id', noStore, protect, deleteFAQ);

// Testimonials
router.get('/testimonials', cachePublicData, getTestimonials);
router.get('/testimonials/admin', noStore, protect, getAdminTestimonials);
router.post('/testimonials/admin', noStore, protect, createTestimonial);
router.put('/testimonials/admin/:id', noStore, protect, updateTestimonial);
router.delete('/testimonials/admin/:id', noStore, protect, deleteTestimonial);

export default router;
