import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const rawApiBaseURL = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseURL && import.meta.env.PROD) {
  throw new Error('VITE_API_BASE_URL is missing. Set it in Vercel to your Render backend URL.');
}

const apiBaseURL = (rawApiBaseURL || 'http://localhost:5000').replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
