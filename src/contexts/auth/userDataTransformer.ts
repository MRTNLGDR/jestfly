
/**
 * Utilities for transforming user data between Supabase and app data models
 */

import { User } from '../../models/User';

/**
 * Interface representing a Supabase auth user
 */
export interface SupabaseAuthUser {
  email: string;
  email_confirmed_at?: string | null;
  [key: string]: any;
}

/**
 * Interface representing Supabase profile data
 */
export interface SupabaseProfileData {
  id: string;
  username?: string;
  full_name?: string;
  profile_type?: 'artist' | 'fan' | 'admin' | 'collaborator';
  avatar_url?: string;
  bio?: string;
  social_links?: Record<string, string>;
  wallet_address?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: Record<string, boolean>;
    language?: string;
    currency?: string;
    [key: string]: any;
  };
  roles?: string[];
  [key: string]: any;
}

/**
 * Transform Supabase user data into the app's User model
 * @param supabaseUser The user data from Supabase auth
 * @param profileData The profile data from Supabase profiles table
 * @returns A user object conforming to the app's User model
 */
export const createSupabaseUserData = (
  supabaseUser: SupabaseAuthUser,
  profileData: SupabaseProfileData
): User => {
  // Extract the username from email if not provided
  const usernameFromEmail = supabaseUser.email?.split('@')[0] || '';
  
  // Create default notifications object that meets the expected type
  const defaultNotifications = {
    email: true,
    push: true,
    sms: false
  };

  // Get existing notifications or empty object
  const existingNotifications = profileData.preferences?.notifications || {};

  // Merge profile notifications with defaults to ensure required properties
  const notificationsWithDefaults = {
    ...defaultNotifications,
    ...existingNotifications
  };
  
  // Create a new User object with data from Supabase
  const user: User = {
    id: profileData.id,
    email: supabaseUser.email,
    displayName: profileData.full_name || usernameFromEmail,
    username: profileData.username || usernameFromEmail,
    profileType: profileData.profile_type || 'fan',
    avatar: profileData.avatar_url,
    bio: profileData.bio,
    socialLinks: profileData.social_links || {},
    walletAddress: profileData.wallet_address,
    createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
    updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : new Date(),
    lastLogin: new Date(),
    isVerified: !!supabaseUser.email_confirmed_at,
    twoFactorEnabled: false,
    preferences: {
      theme: profileData.preferences?.theme || 'system',
      notifications: notificationsWithDefaults,
      language: profileData.preferences?.language || 'en',
      currency: profileData.preferences?.currency || 'USD',
    },
    roles: profileData.roles || [],
  };
  
  return user;
};

/**
 * Transform app User model to Supabase profile format for updates
 * @param userData User data from the app's User model
 * @returns Object formatted for Supabase profile updates
 */
export const prepareUserDataForSupabase = (userData: Partial<User>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  // Map fields with different names
  if (userData.displayName !== undefined) {
    result.full_name = userData.displayName;
  }
  
  if (userData.avatar !== undefined) {
    result.avatar_url = userData.avatar;
  }
  
  if (userData.profileType !== undefined) {
    result.profile_type = userData.profileType;
  }
  
  // Copy fields with the same name
  const directMappedFields = [
    'username', 'bio', 'social_links', 'wallet_address', 'preferences'
  ];
  
  directMappedFields.forEach(field => {
    const appField = field === 'social_links' ? 'socialLinks' : field;
    if (userData[appField as keyof Partial<User>] !== undefined) {
      result[field] = userData[appField as keyof Partial<User>];
    }
  });
  
  return result;
};
