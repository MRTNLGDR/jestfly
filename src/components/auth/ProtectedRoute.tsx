
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: ('artist' | 'fan' | 'admin' | 'collaborator')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRoles = []
}) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se autenticação é necessária mas usuário não está logado
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se papéis específicos são necessários e o usuário não tem o papel necessário
  if (requireAuth && requiredRoles.length > 0 && userData && 
      !requiredRoles.includes(userData.profileType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Se o usuário já está logado e tenta acessar páginas de login/registro
  if (!requireAuth && currentUser) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
