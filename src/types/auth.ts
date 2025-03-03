
import { User, Session } from '@supabase/supabase-js';

export interface ProfileData {
  id: string;
  username: string;
  display_name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  profile_type: 'fan' | 'artist' | 'collaborator' | 'admin';
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
  is_verified: boolean | null;
  social_links: Record<string, string> | null;
  preferences: Record<string, any> | null;
}

export interface SignUpUserData {
  display_name: string;
  username: string;
  profile_type: 'fan' | 'artist' | 'collaborator' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signUp: (email: string, password: string, userData: SignUpUserData) => Promise<{
    error: Error | null;
    data: User | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<ProfileData>) => Promise<{
    error: Error | null;
    data: ProfileData | null;
  }>;
  uploadAvatar: (file: File) => Promise<{
    error: Error | null;
    avatarUrl: string | null;
  }>;
  refreshProfile: () => Promise<void>;
}
