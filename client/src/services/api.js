import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
});

// Request interceptor: attach JWT token if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trc_admin_token');
    const requestPath = config.url || '';
    const needsAdminAuth =
      /(^|\/)admin(?:\/|$)/.test(requestPath) || requestPath.startsWith('/upload');

    // Public GETs stay credential-free so browsers/CDNs can cache them.
    if (token && needsAdminAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: centralize error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 unauthorized
      localStorage.removeItem('trc_admin_token');
      localStorage.removeItem('trc_admin_user');
    }
    return Promise.reject(error);
  }
);

export default api;
