import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../utils/tokenStorage';

export default function ProtectedRoute() {
  return getToken() ? <Outlet /> : <Navigate to="/login" replace />;
}