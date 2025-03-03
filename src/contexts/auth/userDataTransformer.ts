
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
  social_links?: Record<string, string> | string;
  wallet_address?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: Record<string, boolean>;
    language?: string;
    currency?: string;
    [key: string]: any;
  } | string | any;
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

  // Parse preferences if it's a string
  let parsedPreferences: any = {};
  if (profileData.preferences) {
    if (typeof profileData.preferences === 'string') {
      try {
        parsedPreferences = JSON.parse(profileData.preferences);
      } catch (e) {
        console.error('Error parsing preferences:', e);
      }
    } else if (typeof profileData.preferences === 'object' && !Array.isArray(profileData.preferences)) {
      parsedPreferences = profileData.preferences;
    }
  }

  // Get existing notifications or empty object
  let existingNotifications: Record<string, boolean> = {};
  if (parsedPreferences.notifications && 
      typeof parsedPreferences.notifications === 'object' && 
      !Array.isArray(parsedPreferences.notifications)) {
    existingNotifications = parsedPreferences.notifications;
  }

  // Merge profile notifications with defaults to ensure required properties
  const notificationsWithDefaults = {
    ...defaultNotifications,
    ...existingNotifications
  };
  
  // Create default preferences object
  const defaultPreferences = {
    theme: 'system' as 'light' | 'dark' | 'system',
    notifications: defaultNotifications,
    language: 'en',
    currency: 'USD'
  };

  // Use profile preferences or default if not available
  const preferences = {
    ...defaultPreferences,
    ...(parsedPreferences || {}),
    // Always ensure notifications are properly structured
    notifications: notificationsWithDefaults
  };
  
  // Parse social links if needed
  let socialLinks: Record<string, string> = {};
  if (profileData.social_links) {
    if (typeof profileData.social_links === 'string') {
      try {
        socialLinks = JSON.parse(profileData.social_links);
      } catch (e) {
        console.error('Error parsing social links:', e);
      }
    } else if (typeof profileData.social_links === 'object') {
      socialLinks = profileData.social_links;
    }
  }
  
  // Create a new User object with data from Supabase
  const user: User = {
    id: profileData.id,
    email: supabaseUser.email,
    displayName: profileData.full_name || usernameFromEmail,
    username: profileData.username || usernameFromEmail,
    profileType: profileData.profile_type || 'fan',
    avatar: profileData.avatar_url,
    bio: profileData.bio,
    socialLinks: socialLinks,
    walletAddress: profileData.wallet_address,
    createdAt: profileData.created_at ? new Date(profileData.created_at) : new Date(),
    updatedAt: profileData.updated_at ? new Date(profileData.updated_at) : new Date(),
    lastLogin: new Date(),
    isVerified: !!supabaseUser.email_confirmed_at,
    twoFactorEnabled: false,
    preferences: preferences,
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
  
  if (userData.walletAddress !== undefined) {
    result.wallet_address = userData.walletAddress;
  }
  
  if (userData.socialLinks !== undefined) {
    result.social_links = userData.socialLinks;
  }
  
  // Copy fields with the same name
  ['username', 'bio', 'preferences'].forEach(field => {
    if (userData[field as keyof Partial<User>] !== undefined) {
      result[field] = userData[field as keyof Partial<User>];
    }
  });
  
  return result;
};
