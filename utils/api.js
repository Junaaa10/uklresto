import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-kuliner.up.railway.app', // URL backend Anda
});

// Otomatis menyertakan Token JWT di setiap request jika user sudah login
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;