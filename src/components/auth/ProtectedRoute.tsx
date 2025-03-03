
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Mostrar mensagem de acesso negado quando necessário
  useEffect(() => {
    if (!loading && requireAuth && !user) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
    } else if (!loading && requiredRole && profile && profile.profile_type !== requiredRole) {
      toast({
        title: "Acesso negado",
        description: `Esta página é restrita para perfis do tipo ${requiredRole}`,
        variant: "destructive",
      });
    } else if (
      !loading && 
      allowedProfiles.length > 0 && 
      profile && 
      !allowedProfiles.includes(profile.profile_type as AllowedProfileTypes)
    ) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
    }
  }, [loading, user, profile, requiredRole, requireAuth, allowedProfiles, toast]);

  // Enquanto a autenticação está carregando, mostrar um spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Verificando credenciais..." />
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
  // redirecionar para a página inicial
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
