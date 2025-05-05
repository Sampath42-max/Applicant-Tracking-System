import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/profile', {
          withCredentials: true,
          timeout: 5000, // Prevent hanging
        });
        console.log('Profile check response:', response.data);
        setIsAuthenticated(!!response.data.username);
      } catch (error) {
        console.log('Profile check failed:', error.message, error.response?.status, error.response?.data);
        // Keep isAuthenticated as is unless explicitly logged out
        setIsAuthenticated(isAuthenticated);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    axios
      .post('http://localhost:5001/api/logout', {}, { withCredentials: true })
      .then(() => console.log('Logout successful'))
      .catch((error) => console.log('Logout failed:', error.message));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};