
import { User } from '../../models/User';

export interface SupabaseAuthUser {
  email: string;
  email_confirmed_at?: string | null;
}

export interface SupabaseProfileData {
  id: string;
  username?: string | null;
  full_name?: string | null;
  profile_type?: 'artist' | 'fan' | 'admin' | 'collaborator';
  avatar_url?: string | null;
  bio?: string | null;
  social_links?: Record<string, string>;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: Record<string, boolean>;
    language?: string;
    currency?: string;
    [key: string]: any;
  };
  wallet_address?: string | null;
  created_at?: string;
  updated_at?: string;
  roles?: string[];
}

/**
 * Transforma os dados do usuário do Supabase para o formato usado na aplicação
 */
export const createSupabaseUserData = (
  authUser: SupabaseAuthUser,
  profileData: SupabaseProfileData
): User => {
  // Criar objeto User a partir dos dados do Supabase
  return {
    id: profileData.id,
    email: authUser.email,
    username: profileData.username || '',
    displayName: profileData.full_name || profileData.username || '',
    profileType: profileData.profile_type || 'fan',
    avatar: profileData.avatar_url || undefined,
    bio: profileData.bio || undefined,
    socialLinks: profileData.social_links || {},
    walletAddress: profileData.wallet_address || undefined,
    createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
    updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : new Date(),
    lastLogin: new Date(),
    isVerified: !!authUser.email_confirmed_at,
    twoFactorEnabled: false,
    preferences: {
      theme: (profileData.preferences?.theme as 'light' | 'dark' | 'system') || 'system',
      notifications: profileData.preferences?.notifications || {
        email: true,
        push: true,
        sms: false
      },
      language: profileData.preferences?.language || 'pt',
      currency: profileData.preferences?.currency || 'BRL',
      ...(profileData.preferences || {})
    },
    roles: profileData.roles || []
  };
};
