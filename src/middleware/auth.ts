
import { NavigateFunction } from 'react-router-dom';
import { AuthService } from '@/services/AuthService';
import { ProfileData } from '@/types/auth';

/**
 * Middleware para verificar autenticação e permissões
 */
export const AuthMiddleware = {
  /**
   * Verifica se o usuário está autenticado
   */
  requireAuth: async (navigate: NavigateFunction): Promise<boolean> => {
    try {
      console.log('[AuthMiddleware] Verificando autenticação do usuário');
      const { user } = await AuthService.getCurrentUser();
      
      if (!user) {
        console.log('[AuthMiddleware] Usuário não autenticado, redirecionando para /auth');
        navigate('/auth');
        return false;
      }
      
      console.log('[AuthMiddleware] Usuário autenticado com sucesso');
      return true;
    } catch (error) {
      console.error('[AuthMiddleware] Erro ao verificar autenticação:', error);
      navigate('/auth');
      return false;
    }
  },

  /**
   * Verifica se o usuário tem o tipo de perfil específico
   */
  requireProfileType: async (
    profileType: string,
    navigate: NavigateFunction
  ): Promise<boolean> => {
    try {
      console.log(`[AuthMiddleware] Verificando perfil ${profileType}`);
      const { user, profile } = await AuthService.getCurrentUser();
      
      if (!user || !profile) {
        console.log('[AuthMiddleware] Usuário não autenticado ou sem perfil, redirecionando para /auth');
        navigate('/auth');
        return false;
      }
      
      if (profile.profile_type !== profileType) {
        console.log(`[AuthMiddleware] Usuário não tem perfil ${profileType}, redirecionando para /`);
        navigate('/');
        return false;
      }
      
      console.log(`[AuthMiddleware] Usuário com perfil ${profileType} verificado com sucesso`);
      return true;
    } catch (error) {
      console.error('[AuthMiddleware] Erro ao verificar tipo de perfil:', error);
      navigate('/');
      return false;
    }
  },

  /**
   * Verifica se o usuário tem um dos tipos de perfil permitidos
   */
  requireAnyProfileType: async (
    allowedTypes: string[],
    navigate: NavigateFunction
  ): Promise<boolean> => {
    try {
      console.log(`[AuthMiddleware] Verificando se usuário tem um dos perfis: ${allowedTypes.join(', ')}`);
      const { user, profile } = await AuthService.getCurrentUser();
      
      if (!user || !profile) {
        console.log('[AuthMiddleware] Usuário não autenticado ou sem perfil, redirecionando para /auth');
        navigate('/auth');
        return false;
      }
      
      if (!allowedTypes.includes(profile.profile_type)) {
        console.log(`[AuthMiddleware] Usuário com perfil ${profile.profile_type} não está entre os permitidos: ${allowedTypes.join(', ')}`);
        navigate('/');
        return false;
      }
      
      console.log(`[AuthMiddleware] Usuário com perfil ${profile.profile_type} tem acesso permitido`);
      return true;
    } catch (error) {
      console.error('[AuthMiddleware] Erro ao verificar tipos de perfil permitidos:', error);
      navigate('/');
      return false;
    }
  },

  /**
   * Verifica se o usuário é proprietário do recurso
   */
  isResourceOwner: (userId: string, resourceUserId: string): boolean => {
    const isOwner = userId === resourceUserId;
    console.log(`[AuthMiddleware] Verificação de proprietário: ${isOwner ? 'É proprietário' : 'Não é proprietário'}`);
    return isOwner;
  },

  /**
   * Verifica se o usuário é admin
   */
  isAdmin: (profile: ProfileData | null): boolean => {
    const isAdmin = profile?.profile_type === 'admin';
    console.log(`[AuthMiddleware] Verificação de admin: ${isAdmin ? 'É admin' : 'Não é admin'}`);
    return isAdmin;
  },

  /**
   * Obtém os tipos de acesso do usuário com base no perfil
   */
  getUserAccessTypes: (profile: ProfileData | null): string[] => {
    if (!profile) {
      console.log('[AuthMiddleware] Sem perfil de usuário, retornando lista vazia de acessos');
      return [];
    }
    
    const access = ['user'];
    
    switch (profile.profile_type) {
      case 'admin':
        access.push('admin', 'moderator', 'artist', 'collaborator', 'fan');
        break;
      case 'collaborator':
        access.push('moderator', 'collaborator');
        break;
      case 'artist':
        access.push('artist');
        break;
      case 'fan':
        access.push('fan');
        break;
    }
    
    console.log(`[AuthMiddleware] Tipos de acesso para perfil ${profile.profile_type}: ${access.join(', ')}`);
    return access;
  },
  
  /**
   * Verifica se o usuário tem acesso a um recurso específico
   */
  hasAccess: (profile: ProfileData | null, requiredAccess: string): boolean => {
    const accessTypes = AuthMiddleware.getUserAccessTypes(profile);
    const hasAccess = accessTypes.includes(requiredAccess);
    console.log(`[AuthMiddleware] Verificação de acesso '${requiredAccess}': ${hasAccess ? 'Tem acesso' : 'Não tem acesso'}`);
    return hasAccess;
  }
};

export default AuthMiddleware;
