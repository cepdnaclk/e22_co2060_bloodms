import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', // Your Django API base URL
});

// Automatically add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;