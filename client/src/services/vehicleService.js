import api from './api';

export const vehicleService = {
  // Public
  getVehicles: async (params = {}, config = {}) => {
    const response = await api.get('/vehicles', { ...config, params });
    return response.data;
  },

  getFeaturedVehicles: async () => {
    const response = await api.get('/vehicles/featured');
    return response.data;
  },

  getVehicleBySlug: async (slug) => {
    const response = await api.get(`/vehicles/${slug}`);
    return response.data;
  },

  getSimilarVehicles: async (slug) => {
    const response = await api.get(`/vehicles/${slug}/similar`);
    return response.data;
  },

  // Admin
  getAdminVehicles: async () => {
    const response = await api.get('/vehicles/admin/all');
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles/admin', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/admin/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/admin/${id}`);
    return response.data;
  }
};
