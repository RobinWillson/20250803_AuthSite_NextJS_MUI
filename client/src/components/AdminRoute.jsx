import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';



const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If the user is authenticated and has the 'admin' role, render the children.
  if (isAuthenticated && user?.role === 'admin') {
    return children;
  }

  // Otherwise, redirect them. If they are logged in, send them to the dashboard.
  return <Navigate to={ isAuthenticated ? '/dashboard' : '/' } replace />;
};

export default AdminRoute;