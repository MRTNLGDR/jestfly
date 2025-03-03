
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
  redirectPath?: string;
}

/**
 * Componente de rota protegida aprimorado para controlar acesso com base no tipo de perfil
 */
const ProtectedRouteV2: React.FC<ProtectedRouteProps> = ({
  children,
  allowedProfiles = [],
  requiredRole,
  requireAuth = true,
  redirectPath = '/auth',
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    // Se autenticação é requerida mas usuário não está logado
    if (requireAuth && !user) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      return;
    }

    // Se existe um papel específico requerido e o usuário não tem este papel
    if (requiredRole && profile && profile.profile_type !== requiredRole) {
      toast({
        title: "Acesso negado",
        description: `Esta página é restrita para perfis do tipo ${requiredRole}`,
        variant: "destructive",
      });
      return;
    }

    // Se existem perfis permitidos e o perfil do usuário não está entre eles
    if (
      allowedProfiles.length > 0 && 
      profile && 
      !allowedProfiles.includes(profile.profile_type as AllowedProfileTypes)
    ) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      return;
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
    console.log('[ProtectedRouteV2] Usuário não autenticado, redirecionando para', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Se há um tipo de perfil específico requerido e o perfil do usuário não é esse tipo,
  // redirecionar para a página inicial
  if (requiredRole && profile.profile_type !== requiredRole) {
    console.log(`[ProtectedRouteV2] Usuário não tem perfil requerido ${requiredRole}, redirecionando para /`);
    return <Navigate to="/" replace />;
  }

  // Se há tipos de perfil permitidos e o perfil do usuário não está entre eles,
  // redirecionar para a página inicial
  if (
    allowedProfiles.length > 0 &&
    !allowedProfiles.includes(profile.profile_type as AllowedProfileTypes)
  ) {
    console.log(`[ProtectedRouteV2] Perfil do usuário ${profile.profile_type} não está entre os permitidos ${allowedProfiles.join(', ')}, redirecionando para /`);
    return <Navigate to="/" replace />;
  }

  // Se tudo estiver ok, renderizar o conteúdo protegido
  console.log(`[ProtectedRouteV2] Acesso permitido para perfil ${profile.profile_type}`);
  return <>{children}</>;
};

export default ProtectedRouteV2;
