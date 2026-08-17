import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

export const AdminAuthBoundary = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);
