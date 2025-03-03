
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type AllowedProfileTypes = 'fan' | 'artist' | 'collaborator' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedProfiles?: AllowedProfileTypes[];
  requiredRole?: AllowedProfileTypes;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedProfiles = [],
  requiredRole,
  requireAuth = true,
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Enquanto a autenticação está carregando, mostrar um spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Se não requer autenticação, renderizar as crianças diretamente
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Se requer autenticação mas o usuário não está autenticado,
  // redirecionar para a página de login
  if (!user || !profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se há um tipo de perfil específico requerido e o perfil do usuário não é esse tipo,
  // redirecionar para a página inicial
  if (requiredRole && profile.profile_type !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Se há tipos de perfil permitidos e o perfil do usuário não está entre eles,
  // redirecionar para a página inicial ou mostrar mensagem de acesso negado
  if (
    allowedProfiles.length > 0 &&
    !allowedProfiles.includes(profile.profile_type as AllowedProfileTypes)
  ) {
    return <Navigate to="/" replace />;
  }

  // Se tudo estiver ok, renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
