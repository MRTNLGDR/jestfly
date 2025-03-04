import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedProfiles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedProfiles 
}) => {
  const { profile, loading } = useAuth();
  const location = useLocation();
  const { logSystemActivity } = useActivityLogger();
  
  useEffect(() => {
    const handleAccessAttempt = async () => {
      if (!loading) {
        // If user is logged in but not allowed
        if (profile && allowedProfiles && !allowedProfiles.includes(profile.profile_type)) {
          // Log unauthorized access attempt
          await logSystemActivity(
            'Tentativa de acesso não autorizado',
            { 
              route: location.pathname,
              requiredProfiles: allowedProfiles,
              userProfile: profile.profile_type
            },
            false
          );
        }
        // If user is allowed, log successful access
        else if (profile && (!allowedProfiles || allowedProfiles.includes(profile.profile_type))) {
          await logSystemActivity(
            'Acessou rota protegida',
            { route: location.pathname },
            true
          );
        }
      }
    };
    
    handleAccessAttempt();
  }, [profile, loading, location.pathname, allowedProfiles, logSystemActivity]);
  
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
  
  // If specific profile types are required
  if (allowedProfiles && !allowedProfiles.includes(profile.profile_type)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
