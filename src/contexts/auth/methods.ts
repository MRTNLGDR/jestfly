
// Implement and export all auth methods
import { User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../models/User';
import { toast } from 'sonner';

// Login methods
export const loginUser = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Login error:", error.message);
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No user returned from login");
  }

  return data.user;
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Logout error:", error.message);
    throw new Error(error.message);
  }
};

// Registration methods
export const registerUser = async (
  email: string, 
  password: string, 
  userData: Partial<UserProfile>
): Promise<User> => {
  // Register the user with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: userData.display_name,
        profile_type: userData.profile_type
      }
    }
  });

  if (error) {
    console.error("Registration error:", error.message);
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No user returned from registration");
  }

  try {
    // Create user profile in our profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: userData.email || email,
        display_name: userData.display_name || '',
        profile_type: userData.profile_type || 'fan'
      });

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      // We don't throw here as the auth user was created successfully
      toast.error("Conta criada, mas ocorreu um erro ao criar seu perfil");
    }
  } catch (err) {
    console.error("Profile creation error:", err);
    toast.error("Conta criada, mas ocorreu um erro ao criar seu perfil");
  }

  return data.user;
};

// Password methods
export const resetUserPassword = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });

  if (error) {
    console.error("Password reset error:", error.message);
    throw new Error(error.message);
  }
};

export const updateUserPassword = async (password: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    console.error("Password update error:", error.message);
    throw new Error(error.message);
  }
};

// Profile methods
export const updateUserProfile = async (
  userId: string, 
  data: Partial<UserProfile>
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId);

  if (error) {
    console.error("Profile update error:", error.message);
    throw new Error(error.message);
  }
};

export const fetchUserData = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No user profile found
      console.warn(`No profile found for user: ${userId}`);
      return null;
    }
    console.error("Error fetching user data:", error.message);
    throw new Error(error.message);
  }

  return data as UserProfile;
};
