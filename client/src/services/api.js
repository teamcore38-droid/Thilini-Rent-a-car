import axios from 'axios';
import { reportMonitoringEvent } from '../utils/monitoring';

export const API_ERROR_MESSAGES = {
  unavailable: 'Vehicles are temporarily unavailable. Please try again in a moment.',
  timeout: 'The request took too long. Please check your connection and try again.',
  offline: 'You appear to be offline. Reconnect to the internet and try again.',
  server: 'Something went wrong while loading this information. Please try again.',
  canceled: ''
};

export const classifyApiError = (error) => {
  if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') return 'canceled';
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') return 'timeout';
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
  if (error?.response?.status === 503) return 'unavailable';
  return 'server';
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 7000
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
    config.headers['X-Request-ID'] ||= crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    config.metadata = { startedAt: performance.now() };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: centralize error handling
api.interceptors.response.use(
  (response) => {
    reportMonitoringEvent('api_request', {
      route: response.config?.url,
      method: response.config?.method?.toUpperCase(),
      statusCode: response.status,
      durationMs: performance.now() - (response.config?.metadata?.startedAt || performance.now()),
      category: 'success',
      requestId: response.headers?.['x-request-id']
    });
    return response;
  },
  (error) => {
    const category = classifyApiError(error);
    error.category = category;
    error.userMessage = API_ERROR_MESSAGES[category];

    if (category !== 'canceled') {
      reportMonitoringEvent('api_request', {
        route: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        statusCode: error.response?.status,
        durationMs: performance.now() - (error.config?.metadata?.startedAt || performance.now()),
        category,
        requestId: error.response?.headers?.['x-request-id']
      });
    }
    if (error.response?.status === 401) {
      // Clear token on 401 unauthorized
      localStorage.removeItem('trc_admin_token');
      localStorage.removeItem('trc_admin_user');
    }
    return Promise.reject(error);
  }
);

export default api;
