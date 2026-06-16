import api from './api';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  register: (payload) => api.post(API_ENDPOINTS.REGISTER, payload),
  verifyRegisterOtp: (payload) => api.post(API_ENDPOINTS.VERIFY_REGISTER_OTP, payload),
  login: (payload) => api.post(API_ENDPOINTS.LOGIN, payload),
  verifyLoginOtp: (payload) => api.post(API_ENDPOINTS.VERIFY_LOGIN_OTP, payload),
  getProfile: () => api.get(API_ENDPOINTS.PROFILE),
};
