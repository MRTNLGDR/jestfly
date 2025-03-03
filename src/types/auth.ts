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
  two_factor_enabled?: boolean;
}

export interface SignUpUserData {
  display_name: string;
  username: string;
  profile_type: 'fan' | 'artist' | 'collaborator' | 'admin';
}

export type AuthContextType = {
  user: User | null;
  profile: ProfileData | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
  signUp: (email: string, password: string, userData: SignUpUserData) => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<ProfileData>) => Promise<{ data: ProfileData | null; error: Error | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: Error | null }>;
  refreshProfile: () => Promise<boolean>;
};
