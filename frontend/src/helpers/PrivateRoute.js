import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  if (!localStorage.getItem('token') || localStorage.getItem('token') == "undefined") {
    return <Navigate to="/login" replace />;
  }

  return children;
};