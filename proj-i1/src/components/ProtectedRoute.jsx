import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const authContext = useContext(AuthContext) || { isAuthenticated: false, loading: false };
  const { isAuthenticated, loading } = authContext;

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;