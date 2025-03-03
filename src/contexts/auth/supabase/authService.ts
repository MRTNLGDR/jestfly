
import { supabase } from "../../../integrations/supabase/client";
import { User } from "../../../models/User";
import { checkGoogleAuthEnabled } from "./statusService";
import { fetchUserProfile } from "./profileService";

export const loginWithCredentials = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  });
  
  if (error) throw error;
  
  return data;
};

export const loginWithOAuth = async (provider: 'google') => {
  if (provider === 'google' && !checkGoogleAuthEnabled()) {
    throw new Error('Google authentication is not enabled');
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) throw error;
  
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  
  if (error) throw error;
};

export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName: userData.displayName,
        username: userData.username,
        profileType: userData.profileType
      }
    }
  });
  
  if (error) throw error;
  
  return data;
};
