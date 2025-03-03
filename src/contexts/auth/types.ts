
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../models/User';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyAdminCode: (userId: string, adminCode: string) => Promise<boolean>;
  updateUserProfile: (userId: string, userData: Partial<User>) => Promise<void>;
  loading: boolean;
  error: string | null;
}
