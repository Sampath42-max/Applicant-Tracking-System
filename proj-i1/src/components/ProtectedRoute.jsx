import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const authContext = useContext(AuthContext) || { isAuthenticated: false, loading: false };
  const { isAuthenticated, loading } = authContext;
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">Checking profile...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
