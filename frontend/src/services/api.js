import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

// Articles API
export const articlesAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) searchParams.append(key, params[key]);
    });
    const queryString = searchParams.toString();
    return api.get(`/articles${queryString ? `?${queryString}` : ''}`);
  },
  getTags: () => api.get('/articles/tags'),
  getById: (id) => api.get(`/articles/${id}`),
  create: (article) => api.post('/articles', article),
  update: (id, article) => api.put(`/articles/${id}`, article),
  delete: (id) => api.delete(`/articles/${id}`),
  verify: (url) => api.post('/articles/verify', { url }),
};

// Storyboards API
export const storyboardsAPI = {
  getAll: () => api.get('/storyboards'),
  getById: (id) => api.get(`/storyboards/${id}`),
  create: (storyboard) => api.post('/storyboards', storyboard),
  update: (id, storyboard) => api.put(`/storyboards/${id}`, storyboard),
  delete: (id) => api.delete(`/storyboards/${id}`),
  share: (id) => api.post(`/storyboards/${id}/share`),
};

export default api;
