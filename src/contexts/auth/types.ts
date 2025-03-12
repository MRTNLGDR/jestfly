
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../../models/User';

export type PermissionType = 'admin' | 'artist' | 'fan' | 'collaborator';

export interface AuthContextType {
  currentUser: User | null;
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
