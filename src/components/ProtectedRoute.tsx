
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { PermissionType } from '../contexts/auth/types';
import { Skeleton } from './ui/skeleton';

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
  const { currentUser, loading, hasPermission } = useAuth();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Limit loading time to prevent infinite loading
  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
      return;
    }
    
    // Set a timeout to stop loading after 3 seconds
    const timeout = setTimeout(() => {
      console.log("Protected route loading timeout reached");
      setLocalLoading(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [loading]);

  // If still in initial loading, show skeleton
  if (localLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-purple-950">
        <div className="w-full max-w-md space-y-4 p-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </div>
    );
  }

  // Se autenticação é requerida mas o usuário não está logado
  if (requireAuth && !currentUser) {
    console.log("Auth required but user not logged in, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se roles específicas são requeridas e o usuário não tem a role
  if (requireAuth && requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    console.log("User doesn't have required permissions, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  // Se o usuário já está logado e tenta acessar páginas de login/registro
  if (!requireAuth && currentUser) {
    console.log("User already logged in, redirecting to profile");
    return <Navigate to="/profile" replace />;
  }

  console.log("Protected route rendering children");
  return <>{children}</>;
};
