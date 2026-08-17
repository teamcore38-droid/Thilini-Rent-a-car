import api from './api';
import { getFleetVehicles, invalidateFleetCache } from './fleetCache';

let publicVehicleCacheVersion = '';

const invalidatePublicVehicleData = () => {
  publicVehicleCacheVersion = String(Date.now());
  invalidateFleetCache();
};

export const withVehicleCacheVersion = (params = {}) => ({
  ...params,
  cacheVersion: publicVehicleCacheVersion || undefined
});

export const vehicleService = {
  // Public
  getVehicles: async (params = {}, config = {}) => {
    return getFleetVehicles(withVehicleCacheVersion(params), config);
  },

  getFeaturedVehicles: async () => {
    const response = await api.get('/vehicles/featured');
    return response.data;
  },

  getVehicleBySlug: async (slug, config = {}) => {
    const response = await api.get(`/vehicles/${slug}`, config);
    return response.data;
  },

  getSimilarVehicles: async (category, excludeSlug, config = {}) => {
    const response = await api.get('/vehicles/similar', {
      ...config,
      params: { category, excludeSlug, limit: 3 }
    });
    return response.data;
  },

  // Admin
  getAdminVehicles: async () => {
    const response = await api.get('/vehicles/admin/all');
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles/admin', vehicleData);
    invalidatePublicVehicleData();
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/admin/${id}`, vehicleData);
    invalidatePublicVehicleData();
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/admin/${id}`);
    invalidatePublicVehicleData();
    return response.data;
  }
};
