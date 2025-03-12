
import { User } from '@supabase/supabase-js';
import { User as UserModel } from '../../models/User';

export type PermissionType = 'admin' | 'artist' | 'fan' | 'collaborator';

export interface AuthContextType {
  currentUser: User | null;
  userData: UserModel | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<UserModel>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserModel>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAdmin: boolean;
  isArtist: boolean;
  hasPermission: (requiredPermission: PermissionType | PermissionType[]) => boolean;
}
