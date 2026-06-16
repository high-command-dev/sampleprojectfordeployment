export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Auth Demo App';

export const NAV_LINKS = [{ label: 'Home', path: '/' }];

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_REGISTER_OTP: '/auth/verify-register-otp',
  VERIFY_LOGIN_OTP: '/auth/verify-login-otp',
  PROFILE: '/auth/profile',
};
