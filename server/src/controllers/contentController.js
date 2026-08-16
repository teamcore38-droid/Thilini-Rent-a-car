import { Service } from '../models/Service.js';
import { FAQ } from '../models/FAQ.js';
import { Testimonial } from '../models/Testimonial.js';

// --- SERVICES ---
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 }).lean();
    res.status(200).json({ success: true, count: services.length, services });
  } catch (error) {
    next(error);
  }
};

export const getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 }).lean();
    res.status(200).json({ success: true, count: services.length, services });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const service = await Service.create({ ...req.body, slug });
    res.status(201).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};

// --- FAQS ---
export const getFAQs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { active: true };
    if (category) query.category = category;

    const faqs = await FAQ.find(query).sort({ order: 1 }).lean();
    res.status(200).json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    next(error);
  }
};

export const getAdminFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ category: 1, order: 1 }).lean();
    res.status(200).json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    next(error);
  }
};

export const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    next(error);
  }
};

// --- TESTIMONIALS ---
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ order: 1 }).lean();
    res.status(200).json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    next(error);
  }
};

export const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 }).lean();
    res.status(200).json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, testimonial });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};
