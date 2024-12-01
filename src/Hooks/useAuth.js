// src/hooks/useAuth.js
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const login = async (credentials) => {
    try {
      await context.login(credentials);
      navigate('/dashboard');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await context.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const checkPermission = (requiredRole) => {
    if (!context.user) return false;
    return context.user.role === requiredRole;
  };

  return {
    user: context.user,
    isAuthenticated: !!context.user,
    isLoading: context.loading,
    login,
    logout,
    checkPermission
  };
};