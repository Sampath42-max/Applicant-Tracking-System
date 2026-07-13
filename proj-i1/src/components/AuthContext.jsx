import React, { createContext, useEffect, useState } from 'react';
import { API_ENDPOINTS, apiCall } from '../config/api.js';
import API_BASE_URL from '../config/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const data = await apiCall(`${API_BASE_URL}/api/profile`);
      setUser(data.user || null);
      setIsAuthenticated(!!data.user);
      return data.user || null;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await refreshProfile();
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (profile) => {
    if (profile) setUser(profile);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiCall(API_ENDPOINTS.LOGOUT, { method: 'POST' });
    } catch (error) {
      console.log('Logout failed:', error.message);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
