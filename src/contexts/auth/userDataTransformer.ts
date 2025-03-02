
import { User } from "../../models/User";

export const createSupabaseUserData = (
  authUser: any, 
  profile: any
): User => {
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
    socialLinks: profile.social_links || {},
    preferences: profile.preferences || {
      theme: 'system',
      language: 'pt',
      currency: 'BRL',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    collectionItems: [],
    transactions: []
  };
};
