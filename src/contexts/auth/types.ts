
import { User } from '../../models/User';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthContextType {
  currentUser: SupabaseUser | null;
  userData: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  session: Session | null;
}
