
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiredRoles,
  requireAuth = true
}) => {
  // Always provide access without authentication
  return <>{children}</>;
};
