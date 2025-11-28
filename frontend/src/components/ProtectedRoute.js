// File: frontend/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if the user has a token in local storage
  const token = localStorage.getItem('token');

  // If there's a token, show the child component (e.g., Dashboard)
  // If not, redirect them to the /login page
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;