
import { User } from "../../models/User";

export const createSupabaseUserData = (
  authUser: any, 
  profile: any
): User => {
  // Process socialLinks
  const socialLinks: User['socialLinks'] = typeof profile.social_links === 'object' 
    ? profile.social_links 
    : {};

  // Process preferences
  const preferences: User['preferences'] = profile.preferences || {
    theme: 'system' as const,
    language: 'pt',
    currency: 'BRL',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  };

  return {
    id: profile.id,
    email: authUser.email || '',
    username: profile.username || '',
    displayName: profile.full_name || authUser.email?.split('@')[0] || '',
    profileType: profile.profile_type || 'fan',
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at),
    lastLogin: new Date(),
    isVerified: authUser.email_confirmed_at !== null,
    twoFactorEnabled: false,
    socialLinks,
    preferences,
    avatar: profile.avatar_url,
    bio: profile.bio,
    walletAddress: profile.wallet_address,
    roles: [] // Default empty roles array
  };
};
