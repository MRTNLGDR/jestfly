
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children
}) => {
  // All routes are now public, no authentication check needed
  return <>{children}</>;
};
