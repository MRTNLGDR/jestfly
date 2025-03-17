
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
  const { currentUser, hasPermission } = useAuth();
  
  // Se não requerer autenticação, renderiza o conteúdo normalmente
  if (!requireAuth) {
    return <>{children}</>;
  }
  
  // Se requerer autenticação mas o usuário não estiver logado
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Se tiver roles específicas requeridas
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = hasPermission(requiredRoles);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Usuário autenticado e com permissões adequadas
  return <>{children}</>;
};
