
import { UserProfile, ProfileType } from '../../types/auth';

export type PermissionType = ProfileType;

export interface AuthContextType {
  currentUser: any | null;
  userData: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAdmin: boolean;
  isArtist: boolean;
  hasPermission: (requiredPermission: PermissionType | PermissionType[]) => boolean;
}
