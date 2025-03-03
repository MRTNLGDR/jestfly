
import { User } from '../../../models/User';
import { supabase } from '../../../integrations/supabase/client';

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      username: data.username,
      profileType: data.profile_type,
      socialLinks: data.social_links || {},
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastLogin: new Date(data.last_login),
      isVerified: data.is_verified,
      twoFactorEnabled: data.two_factor_enabled,
      preferences: data.preferences
    };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  try {
    // Convert User model to profiles table format
    const profileUpdates: any = {};
    
    if (updates.displayName) profileUpdates.display_name = updates.displayName;
    if (updates.username) profileUpdates.username = updates.username;
    if (updates.profileType) profileUpdates.profile_type = updates.profileType;
    if (updates.socialLinks) profileUpdates.social_links = updates.socialLinks;
    if (updates.isVerified !== undefined) profileUpdates.is_verified = updates.isVerified;
    if (updates.twoFactorEnabled !== undefined) profileUpdates.two_factor_enabled = updates.twoFactorEnabled;
    if (updates.preferences) profileUpdates.preferences = updates.preferences;

    const { data, error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      username: data.username,
      profileType: data.profile_type,
      socialLinks: data.social_links || {},
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastLogin: new Date(data.last_login),
      isVerified: data.is_verified,
      twoFactorEnabled: data.two_factor_enabled,
      preferences: data.preferences
    };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return null;
  }
};
