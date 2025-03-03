
import { User } from "../../models/User";

/**
 * Transforms Supabase user data to application User model
 * @param authUser The authenticated user data from Supabase
 * @param profile The user profile data from Supabase profiles table
 * @returns Formatted User object for the application
 */
export const createSupabaseUserData = (
  authUser: any, 
  profile: any
): User => {
  // Process socialLinks
  const socialLinks: User['socialLinks'] = typeof profile.social_links === 'object' 
    ? profile.social_links 
    : {};

  // Process preferences with proper defaults
  const preferences: User['preferences'] = typeof profile.preferences === 'object'
    ? {
        theme: ((profile.preferences as any)?.theme || 'dark') as 'light' | 'dark' | 'system',
        notifications: {
          email: Boolean((profile.preferences as any)?.notifications?.email || true),
          push: Boolean((profile.preferences as any)?.notifications?.push || true),
          sms: Boolean((profile.preferences as any)?.notifications?.sms || false)
        },
        language: (profile.preferences as any)?.language || 'pt',
        currency: (profile.preferences as any)?.currency || 'BRL'
      }
    : {
        theme: 'dark' as const,
        notifications: { email: true, push: true, sms: false },
        language: 'pt',
        currency: 'BRL'
      };

  // Map Supabase profile to User model
  return {
    id: profile.id,
    email: authUser.email || '',
    username: profile.username || '',
    displayName: profile.full_name || authUser.email?.split('@')[0] || '',
    profileType: (profile.profile_type || 'fan') as 'artist' | 'fan' | 'admin' | 'collaborator',
    createdAt: new Date(profile.created_at || Date.now()),
    updatedAt: new Date(profile.updated_at || Date.now()),
    lastLogin: new Date(),
    isVerified: Boolean(authUser.email_confirmed_at),
    twoFactorEnabled: false,
    socialLinks,
    preferences,
    avatar: profile.avatar_url,
    bio: profile.bio,
    walletAddress: profile.wallet_address,
    roles: Array.isArray(profile.roles) ? profile.roles : []
  };
};

/**
 * Prepares user data for updating in Supabase
 * @param userData User data to transform for Supabase
 * @returns Formatted data for Supabase update
 */
export const prepareUserDataForSupabase = (userData: Partial<User>) => {
  // Prepare the data structure for Supabase profiles table
  const profileData: Record<string, any> = {};
  
  if (userData.username !== undefined) profileData.username = userData.username;
  if (userData.displayName !== undefined) profileData.full_name = userData.displayName;
  if (userData.profileType !== undefined) profileData.profile_type = userData.profileType;
  if (userData.bio !== undefined) profileData.bio = userData.bio;
  if (userData.avatar !== undefined) profileData.avatar_url = userData.avatar;
  if (userData.walletAddress !== undefined) profileData.wallet_address = userData.walletAddress;
  
  // Handle complex objects that need to be stored as JSON
  if (userData.socialLinks) {
    profileData.social_links = userData.socialLinks;
  }
  
  if (userData.preferences) {
    profileData.preferences = userData.preferences;
  }
  
  // Add updated timestamp
  profileData.updated_at = new Date().toISOString();
  
  return profileData;
};
