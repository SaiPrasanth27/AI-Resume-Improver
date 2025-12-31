import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { safeLocalStorage, safeAsync } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => safeLocalStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        const result = await safeAsync(async () => {
          console.log('Checking authentication with token...');
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
            timeout: 10000
          });
          console.log('Auth check successful:', response.data.user);
          return response.data.user;
        });

        if (result) {
          setUser(result);
        } else {
          // Clear invalid token
          safeLocalStorage.removeItem('token');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    // Add a small delay to avoid race conditions with browser extensions
    const timeoutId = setTimeout(checkAuth, 200);
    return () => clearTimeout(timeoutId);
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response received:', response.status);
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      safeLocalStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      console.log('Login successful for user:', userData.name);
      return { success: true };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      let errorMessage = 'Login failed';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid credentials';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      safeLocalStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    safeLocalStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};