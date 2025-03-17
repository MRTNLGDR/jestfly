
import { UserProfile } from '../../../types/auth';
import { PermissionType } from '../types';

/**
 * Check if a user has the required permission
 */
export const hasPermission = (
  userData: UserProfile | null,
  requiredPermission: PermissionType | PermissionType[]
): boolean => {
  if (!userData) return false;
  
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.includes(userData.profile_type as PermissionType);
  }
  
  return userData.profile_type === requiredPermission;
};

/**
 * Check if a user is an admin
 */
export const isUserAdmin = (userData: UserProfile | null): boolean => {
  return userData?.profile_type === 'admin';
};

/**
 * Check if a user is an artist
 */
export const isUserArtist = (userData: UserProfile | null): boolean => {
  return userData?.profile_type === 'artist';
};
