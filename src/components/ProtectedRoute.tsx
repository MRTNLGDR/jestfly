
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from './ui/card';
import { Loader2 } from 'lucide-react';

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
  const { user, profile, loading, isAdmin, refreshProfile } = useAuth();
  const location = useLocation();

  // Tenta atualizar o perfil ao entrar na rota protegida
  useEffect(() => {
    if (user && !loading && !profile) {
      refreshProfile();
    }
  }, [user, loading, profile, refreshProfile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Card className="w-64 h-64 bg-black/40 border-purple-900/30 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
            <div className="text-purple-400 text-xl font-medium">Carregando...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    // Redirecionar para login e lembrar para onde estava indo
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Se for admin, permite acesso a tudo
  if (isAdmin()) {
    return <>{children}</>;
  }

  // Verificar o tipo de perfil necessário
  if (requiredProfileType && profile?.profile_type !== requiredProfileType) {
    // Exibir permissão negada ou redirecionar para home
    return <Navigate to="/permission-denied" replace />;
  }

  // Verificar permissão necessária
  if (requiredPermission && !profile?.permissions?.includes(requiredPermission)) {
    // Exibir permissão negada ou redirecionar para home
    return <Navigate to="/permission-denied" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
