
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { ProfileType } from '../types/auth';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: ProfileType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRoles = []
}) => {
  const { currentUser, userData, loading, error, hasPermission, refreshUserData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Mostrar erros de autenticação
  useEffect(() => {
    if (error) {
      toast.error(`Erro de autenticação: ${error}`);
    }
  }, [error]);
  
  // Limitar tempo de carregamento para evitar carregamento infinito
  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
      return;
    }
    
    // Definir um timeout para parar o carregamento após 10 segundos
    const timeout = setTimeout(() => {
      console.log("Timeout de carregamento da rota protegida atingido");
      setLocalLoading(false);
      toast.error("Tempo limite excedido ao verificar autenticação");
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [loading]);
  
  // Lógica de nova tentativa automática
  useEffect(() => {
    if (!loading && error && loadAttempts < 3) {
      const retryTimeout = setTimeout(() => {
        console.log(`Tentativa automática ${loadAttempts + 1}`);
        setLoadAttempts(prev => prev + 1);
        setLocalLoading(true);
        refreshUserData();
      }, 2000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [loading, error, loadAttempts, refreshUserData]);

  const handleManualRetry = () => {
    setLocalLoading(true);
    setLoadAttempts(0);
    refreshUserData();
  };

  const handleForceLogout = async () => {
    try {
      await logout();
      toast.success("Logout forçado realizado com sucesso");
      navigate('/login');
    } catch (err) {
      toast.error("Falha no logout forçado. Tente recarregar a página.");
    }
  };

  // Se ainda estiver no carregamento inicial, mostrar esqueleto
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

  // Se temos erro após tentativas de carregamento, mostrar opção de retry manual e logout forçado
  if (error && loadAttempts >= 3) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-purple-950">
        <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Erro de Autenticação</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={handleManualRetry}
              className="flex items-center justify-center space-x-2 bg-purple-700 hover:bg-purple-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Tentar Novamente</span>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleForceLogout}
              className="bg-red-700 hover:bg-red-800"
            >
              Forçar Logout
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
    console.log("Autenticação requerida mas usuário não está logado, redirecionando para login");
    toast.error("Faça login para acessar esta página");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se roles específicas são requeridas e o usuário não tem a role
  if (requireAuth && requiredRoles.length > 0) {
    // Verificar primeiro se temos dados do usuário
    if (!userData) {
      console.error("Usuário está autenticado mas userData está ausente");
      toast.error("Dados do usuário não disponíveis. Tente fazer login novamente.");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Agora verificar permissões
    if (!hasPermission(requiredRoles)) {
      console.log("Usuário não tem as permissões necessárias, redirecionando para não autorizado");
      toast.error("Você não tem permissão para acessar esta página");
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Se o usuário já está logado e tenta acessar páginas de login/registro
  if (!requireAuth && currentUser) {
    console.log("Usuário já está logado, redirecionando para perfil");
    return <Navigate to="/profile" replace />;
  }

  console.log("Rota protegida renderizando filhos");
  return <>{children}</>;
};
