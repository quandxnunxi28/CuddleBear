import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// ✅ Khi development, dùng /api và Vite proxy sẽ forward tới backend
// Khi production, thay đổi BASE_URL sang domain thực
const API_BASE_URL = 'https://cuddleshop-c7g8e3exb6eqa8dq.southeastasia-01.azurewebsites.net/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,

});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
