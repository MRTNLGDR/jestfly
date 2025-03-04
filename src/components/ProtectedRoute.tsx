
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredProfileType?: string;
  allowedProfiles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredProfileType,
  allowedProfiles 
}) => {
  const { profile, loading } = useAuth();
  const location = useLocation();
  const { logSystemActivity } = useActivityLogger();
  
  // Check if we should log route access
  React.useEffect(() => {
    const handleAccessAttempt = async () => {
      if (!loading) {
        // If user is logged in but not allowed
        if (profile && 
          ((requiredProfileType && profile.profile_type !== requiredProfileType) || 
          (allowedProfiles && !allowedProfiles.includes(profile.profile_type)))) {
          // Log unauthorized access attempt
          await logSystemActivity(
            'Tentativa de acesso não autorizado',
            { 
              route: location.pathname,
              requiredProfile: requiredProfileType || 'any',
              allowedProfiles: allowedProfiles || [],
              userProfile: profile.profile_type
            },
            false
          );
        }
        // If user is allowed, log successful access
        else if (profile) {
          await logSystemActivity(
            'Acessou rota protegida',
            { route: location.pathname },
            true
          );
        }
      }
    };
    
    handleAccessAttempt();
  }, [profile, loading, location.pathname, allowedProfiles, requiredProfileType, logSystemActivity]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Verificando credenciais..." />
      </div>
    );
  }
  
  // If not logged in, redirect to auth page
  if (!profile) {
    // Store the location for redirect after login
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If specific profile type is required and user doesn't have it
  if (requiredProfileType && profile.profile_type !== requiredProfileType) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If specific profile types are allowed and user doesn't have one
  if (allowedProfiles && !allowedProfiles.includes(profile.profile_type)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If all checks pass, render the children or outlet
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
