
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../models/User';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
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
  hasPermission: (requiredPermission: 'admin' | 'artist' | 'fan' | 'collaborator' | string[]) => boolean;
}
