import axios from 'axios';

// Instance for /api endpoints (auth, writes)
export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 5000,
});

// Instance for /cache endpoints (reads, cached)
export const cacheApi = axios.create({
  baseURL: 'http://localhost:4000/cache',
  timeout: 5000,
});

// Attach JWT token from localStorage if available
const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken);
cacheApi.interceptors.request.use(attachToken); 
