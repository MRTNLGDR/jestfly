
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { PermissionType } from '../contexts/auth/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: PermissionType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRoles = []
}) => {
  const { currentUser, userData, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Se autenticação é requerida mas o usuário não está logado
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se roles específicas são requeridas e o usuário não tem a role
  if (requireAuth && requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Se o usuário já está logado e tenta acessar páginas de login/registro
  if (!requireAuth && currentUser) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
