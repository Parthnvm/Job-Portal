import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, recruiterOnly = false }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (recruiterOnly && user?.role !== 'recruiter') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
