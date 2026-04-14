// =============================================
// API UTILITY - Axios instance with auth header
// =============================================
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mingos_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - auto logout
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mingos_token');
      localStorage.removeItem('mingos_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
