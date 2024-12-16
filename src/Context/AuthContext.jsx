// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth token
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // This would be an API call in production
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Validate token with backend
        setUser({ id: '1', name: 'Dr. Sarah Thompson', role: 'doctor' });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // This would be an API call in production
      const response = await mockLoginAPI(credentials);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      
      // Role-based navigation
      switch (response.user.role) {
        case 'doctor':
          navigate('/MainLayout/doctor');
          break;
        case 'admin':
          navigate('/MainLayout/admin');
          break;
        case 'patient':
          navigate('/MainLayout/patient');
          break;
        default:
          navigate('/MainLayout');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      // This would be an API call in production
      localStorage.removeItem('auth_token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Mock API call - remove in production
  const mockLoginAPI = async (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock_token',
          user: { id: '1', name: 'Dr. Sarah Thompson', role: 'doctor' }
        });
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        isAuthenticated: !!user
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);