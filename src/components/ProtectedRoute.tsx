
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { PermissionType } from '../contexts/auth/types';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

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
  const { currentUser, userData, loading, error, hasPermission, refreshUserData } = useAuth();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Mostrar erros de autenticação
  useEffect(() => {
    if (error) {
      toast.error(`Erro de autenticação: ${error}`);
    }
  }, [error]);
  
  // Limit loading time to prevent infinite loading
  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
      return;
    }
    
    // Set a timeout to stop loading after 8 seconds (increased from 3)
    const timeout = setTimeout(() => {
      console.log("Protected route loading timeout reached");
      setLocalLoading(false);
      toast.error("Tempo limite excedido ao verificar autenticação");
    }, 8000);
    
    return () => clearTimeout(timeout);
  }, [loading]);
  
  // Auto retry logic
  useEffect(() => {
    if (!loading && error && loadAttempts < 2) {
      const retryTimeout = setTimeout(() => {
        console.log(`Auto retry attempt ${loadAttempts + 1}`);
        setLoadAttempts(prev => prev + 1);
        setLocalLoading(true);
        refreshUserData();
      }, 2000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [loading, error, loadAttempts, refreshUserData]);

  const handleManualRetry = () => {
    setLocalLoading(true);
    refreshUserData();
  };

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

  // Se temos erro após tentativas de carregamento, mostrar opção de retry manual
  if (error && loadAttempts >= 2) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-purple-950">
        <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-3">Erro de Autenticação</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={handleManualRetry}
              className="flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Tentar Novamente</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Recarregar Página
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Se autenticação é requerida mas o usuário não está logado
  if (requireAuth && !currentUser) {
    console.log("Auth required but user not logged in, redirecting to login");
    toast.error("Faça login para acessar esta página");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se roles específicas são requeridas e o usuário não tem a role
  if (requireAuth && requiredRoles.length > 0) {
    // Verificar primeiro se temos dados do usuário
    if (!userData) {
      console.error("User is authenticated but userData is missing");
      toast.error("Dados do usuário não disponíveis. Tente fazer login novamente.");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Agora verificar permissões
    if (!hasPermission(requiredRoles)) {
      console.log("User doesn't have required permissions, redirecting to unauthorized");
      toast.error("Você não tem permissão para acessar esta página");
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Se o usuário já está logado e tenta acessar páginas de login/registro
  if (!requireAuth && currentUser) {
    console.log("User already logged in, redirecting to profile");
    return <Navigate to="/profile" replace />;
  }

  console.log("Protected route rendering children");
  return <>{children}</>;
};
