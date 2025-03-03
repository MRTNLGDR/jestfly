
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProfileType?: 'admin' | 'artist' | 'collaborator' | 'fan';
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredProfileType,
  requiredPermission
}) => {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-purple-400 animate-pulse text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but remember where they were trying to go
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin, allow access to everything
  if (isAdmin()) {
    return <>{children}</>;
  }

  // Check for required profile type
  if (requiredProfileType && profile?.profile_type !== requiredProfileType) {
    // Display permission denied or redirect to home
    return <Navigate to="/permission-denied" replace />;
  }

  // Check for required permission
  if (requiredPermission && !profile?.permissions?.includes(requiredPermission)) {
    // Display permission denied or redirect to home
    return <Navigate to="/permission-denied" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
