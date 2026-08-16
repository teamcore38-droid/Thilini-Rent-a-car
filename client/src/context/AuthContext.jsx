import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('trc_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('trc_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('trc_admin_token');
      if (savedToken) {
        try {
          const data = await authService.getProfile();
          if (data?.admin) {
            setAdmin(data.admin);
            setToken(savedToken);
          }
        } catch {
          setAdmin(null);
          setToken(null);
          localStorage.removeItem('trc_admin_token');
          localStorage.removeItem('trc_admin_user');
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data?.token && data?.admin) {
      setAdmin(data.admin);
      setToken(data.token);
    }
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
    setToken(null);
  };

  const updateProfile = async (profileData) => {
    const data = await authService.updateProfile(profileData);
    if (data?.admin) {
      setAdmin((prev) => ({ ...prev, ...data.admin }));
      localStorage.setItem('trc_admin_user', JSON.stringify({ ...admin, ...data.admin }));
    }
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
