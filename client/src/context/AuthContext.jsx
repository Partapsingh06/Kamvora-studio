import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kamvora_token') || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kamvora_token');
  };

  // Check current session on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/profile');
        if (data.success && data.data) {
          setUser(data.data);
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success && data.data) {
      const userPayload = data.data;
      setUser(userPayload);
      setToken(userPayload.token);
      localStorage.setItem('kamvora_token', userPayload.token);
      return userPayload;
    }
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    if (data.success && data.data) {
      const userPayload = data.data;
      setUser(userPayload);
      setToken(userPayload.token);
      localStorage.setItem('kamvora_token', userPayload.token);
      return userPayload;
    }
  };

  const updateProfile = async (updates) => {
    const { data } = await api.put('/auth/profile', updates);
    if (data.success && data.data) {
      setUser((prev) => ({ ...prev, ...data.data }));
      if (data.data.token) {
        setToken(data.data.token);
        localStorage.setItem('kamvora_token', data.data.token);
      }
      return data.data;
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        loading,
        login,
        register,
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
