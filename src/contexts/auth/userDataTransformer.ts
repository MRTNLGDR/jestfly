
import { User } from "../../models/User";

export const createSupabaseUserData = (
  authUser: any, 
  profile: any, 
  profileType: 'artist' | 'fan' | 'admin' | 'collaborator'
): User => {
  return {
    id: profile.id,
    email: authUser.email || '',
    username: profile.username || '',
    displayName: profile.full_name || authUser.email?.split('@')[0] || '',
    profileType,
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at),
    lastLogin: new Date(),
    isVerified: authUser.email_confirmed_at !== null,
    twoFactorEnabled: false,
    socialLinks: {},
    preferences: {
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
