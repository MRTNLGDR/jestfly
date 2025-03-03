
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';

// Definindo os tipos de perfil permitidos
type AllowedProfileTypes = 'fan' | 'artist' | 'collaborator' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedProfiles?: AllowedProfileTypes[];
  requiredRole?: AllowedProfileTypes;
  requireAuth?: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedProfiles = [],
  requiredRole,
  requireAuth = true,
  redirectPath = "/auth",
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Função para verificar permissões baseadas no tipo de perfil
  const hasPermission = () => {
    // Se não requer autenticação, sempre tem permissão
    if (!requireAuth) {
      return true;
    }
    
    // Se não há usuário ou perfil, não tem permissão
    if (!user || !profile) {
      return false;
    }
    
    // Se requer um papel específico
    if (requiredRole && profile.profile_type !== requiredRole) {
      return false;
    }
    
    // Se tem uma lista de perfis permitidos
    if (allowedProfiles.length > 0 && !allowedProfiles.includes(profile.profile_type as AllowedProfileTypes)) {
      return false;
    }
    
    // Caso contrário, tem permissão
    return true;
  };

  // Determinar o caminho de redirecionamento com base no tipo de perfil
  const getRedirectPath = () => {
    // Se o usuário não está autenticado, redirecionar para a página de login
    if (!user || !profile) {
      return redirectPath;
    }
    
    // Se está na rota principal de admin mas não é admin, redirecionar para a home
    if (location.pathname.startsWith('/admin') && profile.profile_type !== 'admin') {
      return '/';
    }
    
    // Se está em rota de artista mas não é artista nem admin
    if (location.pathname.startsWith('/submit-demo') && 
        !['artist', 'admin'].includes(profile.profile_type)) {
      return '/';
    }
    
    // Para outros casos, redirecionar para a home
    return '/';
  };

  // Mostrar mensagem de acesso negado quando necessário
  useEffect(() => {
    if (!loading && requireAuth) {
      if (!user) {
        toast({
          title: "Acesso restrito",
          description: "Faça login para acessar esta página",
          variant: "destructive",
        });
      } else if (!hasPermission()) {
        // Mensagem específica baseada no motivo da restrição
        if (requiredRole) {
          toast({
            title: "Acesso negado",
            description: `Esta página é restrita para perfis do tipo ${requiredRole}`,
            variant: "destructive",
          });
        } else if (allowedProfiles.length > 0) {
          const allowedTypes = allowedProfiles.join(', ');
          toast({
            title: "Acesso negado",
            description: `Esta página é restrita para os seguintes tipos de perfil: ${allowedTypes}`,
            variant: "destructive",
          });
        }
      }
    }
  }, [loading, user, profile, requiredRole, requireAuth, allowedProfiles, toast, location]);

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

  // Se não tem permissão, redirecionar para o caminho determinado
  if (!hasPermission()) {
    return <Navigate to={getRedirectPath()} state={{ from: location }} replace />;
  }

  // Se tudo estiver ok, renderizar o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
