import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyRegisterOtp from '../pages/VerifyRegisterOtp';
import VerifyLoginOtp from '../pages/VerifyLoginOtp';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-register-otp" element={<VerifyRegisterOtp />} />
        <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
