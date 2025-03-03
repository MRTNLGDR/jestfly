
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../../models/User';

export type PermissionType = 'admin' | 'artist' | 'fan' | 'collaborator';

export interface AuthContextType {
  currentUser: SupabaseUser | null;
  userData: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAdmin: boolean;
  isArtist: boolean;
  hasPermission: (requiredPermission: PermissionType | PermissionType[]) => boolean;
}
