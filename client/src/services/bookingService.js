import api from './api';

export const bookingService = {
  // Public
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  checkAvailability: async (checkData) => {
    const response = await api.post('/bookings/check-availability', checkData);
    return response.data;
  },

  lookupBooking: async (reference) => {
    const response = await api.get(`/bookings/lookup/${reference}`);
    return response.data;
  },

  // Admin
  getAdminStats: async () => {
    const response = await api.get('/bookings/admin/stats');
    return response.data;
  },

  getAdminBookings: async (params = {}) => {
    const response = await api.get('/bookings/admin/all', { params });
    return response.data;
  },

  getAdminBookingById: async (id) => {
    const response = await api.get(`/bookings/admin/${id}`);
    return response.data;
  },

  updateAdminBooking: async (id, updateData) => {
    const response = await api.put(`/bookings/admin/${id}`, updateData);
    return response.data;
  },

  exportBookingsCSV: async () => {
    const response = await api.get('/bookings/admin/export/csv', {
      responseType: 'blob'
    });
    return response.data;
  }
};
