// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const ProtectedRoute = ({ element: Element, requiredRole, redirectPath = '/login' }) => {
  const role = useUserStore((state)=> state.role);
  const user = useUserStore((state)=> state.user);

  const isAllowed = user && (!requiredRole || role === requiredRole);

  return isAllowed ? <Element /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
