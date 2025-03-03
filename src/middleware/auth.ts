
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
    const { user } = await AuthService.getCurrentUser();
    if (!user) {
      navigate('/auth');
      return false;
    }
    return true;
  },

  /**
   * Verifica se o usuário tem o tipo de perfil específico
   */
  requireProfileType: async (
    profileType: string,
    navigate: NavigateFunction
  ): Promise<boolean> => {
    const { user, profile } = await AuthService.getCurrentUser();
    
    if (!user || !profile) {
      navigate('/auth');
      return false;
    }
    
    if (profile.profile_type !== profileType) {
      navigate('/');
      return false;
    }
    
    return true;
  },

  /**
   * Verifica se o usuário tem um dos tipos de perfil permitidos
   */
  requireAnyProfileType: async (
    allowedTypes: string[],
    navigate: NavigateFunction
  ): Promise<boolean> => {
    const { user, profile } = await AuthService.getCurrentUser();
    
    if (!user || !profile) {
      navigate('/auth');
      return false;
    }
    
    if (!allowedTypes.includes(profile.profile_type)) {
      navigate('/');
      return false;
    }
    
    return true;
  },

  /**
   * Verifica se o usuário é proprietário do recurso
   */
  isResourceOwner: (userId: string, resourceUserId: string): boolean => {
    return userId === resourceUserId;
  },

  /**
   * Verifica se o usuário é admin
   */
  isAdmin: (profile: ProfileData | null): boolean => {
    return profile?.profile_type === 'admin';
  },

  /**
   * Obtém os tipos de acesso do usuário com base no perfil
   */
  getUserAccessTypes: (profile: ProfileData | null): string[] => {
    if (!profile) return [];
    
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
    
    return access;
  },
  
  /**
   * Verifica se o usuário tem acesso a um recurso específico
   */
  hasAccess: (profile: ProfileData | null, requiredAccess: string): boolean => {
    const accessTypes = AuthMiddleware.getUserAccessTypes(profile);
    return accessTypes.includes(requiredAccess);
  }
};

export default AuthMiddleware;
