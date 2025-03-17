
import { UserProfile } from '../../../types/auth';
import { ProfileType } from '../../../integrations/supabase/schema';

/**
 * Verifica se um usuário possui um nível específico de permissão ou qualquer das listadas
 */
export const hasPermission = (
  userData: UserProfile | null, 
  requiredPermission: ProfileType | ProfileType[]
): boolean => {
  if (!userData) return false;
  
  // Se for um array de permissões, verifica se o usuário tem qualquer uma delas
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some(permission => userData.profile_type === permission);
  }
  
  // Verificação de permissão única
  return userData.profile_type === requiredPermission;
};

/**
 * Verifica se um usuário é administrador
 */
export const isUserAdmin = (userData: UserProfile | null): boolean => {
  return hasPermission(userData, 'admin');
};

/**
 * Verifica se um usuário é artista
 */
export const isUserArtist = (userData: UserProfile | null): boolean => {
  return hasPermission(userData, 'artist');
};

/**
 * Verifica se um usuário é colaborador
 */
export const isUserCollaborator = (userData: UserProfile | null): boolean => {
  return hasPermission(userData, 'collaborator');
};

/**
 * Verifica se um usuário é fã (usuário regular)
 */
export const isUserFan = (userData: UserProfile | null): boolean => {
  return hasPermission(userData, 'fan');
};
