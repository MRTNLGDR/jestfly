
import { UserProfile } from '../../../types/auth';
import { ProfileType } from '../../../integrations/supabase/schema';

/**
 * Check if a user has a specific permission level or any from a list
 */
export const hasPermission = (
  userData: UserProfile | null, 
  requiredPermission: ProfileType | ProfileType[]
): boolean => {
  if (!userData) return false;
  
  // If array of permissions, check if user has any of them
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some(permission => userData.profile_type === permission);
  }
  
  // Single permission check
  return userData.profile_type === requiredPermission;
};

/**
 * Check if a user is an admin
 */
export const isUserAdmin = (userData: UserProfile | null): boolean => {
  return hasPermission(userData, 'admin');
};

/**
 * Check if a user is an artist
 */
export const isUserArtist = (userData: UserProfile | null): boolean => {
  return hasPermission(userData, 'artist');
};
