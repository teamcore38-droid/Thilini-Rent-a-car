import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/admin/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('trc_admin_token', response.data.token);
      localStorage.setItem('trc_admin_user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/admin/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/admin/auth/profile', profileData);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('trc_admin_token');
      localStorage.removeItem('trc_admin_user');
    }
  }
};
