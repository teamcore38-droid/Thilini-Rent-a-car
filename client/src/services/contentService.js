import api from './api';

export const contentService = {
  getHomeContent: async (config = {}) => {
    const response = await api.get('/content/home', config);
    return response.data;
  },

  // Services
  getServices: async () => {
    const response = await api.get('/content/services');
    return response.data;
  },
  getAdminServices: async () => {
    const response = await api.get('/content/services/admin');
    return response.data;
  },
  createService: async (data) => {
    const response = await api.post('/content/services/admin', data);
    return response.data;
  },
  updateService: async (id, data) => {
    const response = await api.put(`/content/services/admin/${id}`, data);
    return response.data;
  },
  deleteService: async (id) => {
    const response = await api.delete(`/content/services/admin/${id}`);
    return response.data;
  },

  // FAQs
  getFAQs: async (category) => {
    const response = await api.get('/content/faqs', { params: { category } });
    return response.data;
  },
  getAdminFAQs: async () => {
    const response = await api.get('/content/faqs/admin');
    return response.data;
  },
  createFAQ: async (data) => {
    const response = await api.post('/content/faqs/admin', data);
    return response.data;
  },
  updateFAQ: async (id, data) => {
    const response = await api.put(`/content/faqs/admin/${id}`, data);
    return response.data;
  },
  deleteFAQ: async (id) => {
    const response = await api.delete(`/content/faqs/admin/${id}`);
    return response.data;
  },

  // Testimonials
  getTestimonials: async () => {
    const response = await api.get('/content/testimonials');
    return response.data;
  },
  getAdminTestimonials: async () => {
    const response = await api.get('/content/testimonials/admin');
    return response.data;
  },
  createTestimonial: async (data) => {
    const response = await api.post('/content/testimonials/admin', data);
    return response.data;
  },
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/content/testimonials/admin/${id}`, data);
    return response.data;
  },
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/content/testimonials/admin/${id}`);
    return response.data;
  }
};
