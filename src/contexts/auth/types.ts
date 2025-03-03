
import { Session, User } from '@supabase/supabase-js';
import { User as AppUser } from '../../models/User';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userData: AppUser | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<AppUser>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  
  // Add this property to maintain compatibility with existing code
  currentUser: AppUser | null;
}
