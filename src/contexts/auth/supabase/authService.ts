
import { supabase } from "../../../integrations/supabase/client";
import { User } from "../../../models/User";
import { statusService } from "./statusService";
import { profileService } from "./profileService";
import { checkGoogleAuthEnabled } from "./statusService";

/**
 * Supabase authentication service
 */
export const supabaseAuthService = {
  // Re-export services from other modules
  isGoogleAuthEnabled: statusService.isGoogleAuthEnabled,
  checkAdminStatus: statusService.checkAdminStatus,
  syncUserProfile: profileService.syncUserProfile,
  getUserProfile: profileService.getUserProfile,

  /**
   * Logs in and checks if user is admin in Supabase
   */
  async loginAndCheckAdmin(email: string, password: string): Promise<{ isAdmin: boolean, user: any }> {
    try {
      // Perform login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('User not found');
      }

      // Check if admin
      const isAdmin = await statusService.checkAdminStatus(data.user.id);

      return { isAdmin, user: data.user };
    } catch (error: any) {
      console.error('Error logging in and checking admin:', error);
      throw error;
    }
  },

  /**
   * Registers a new user in Supabase
   */
  async registerUser(email: string, password: string, userData: Partial<User>): Promise<any> {
    try {
      // Register user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.displayName, 
            profile_type: userData.profileType
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Sync profile
        await profileService.syncUserProfile(data.user.id, userData);
      }

      return data.user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<any> {
    try {
      // First check if Google Auth is enabled
      const isEnabled = await checkGoogleAuthEnabled();
      if (!isEnabled) {
        throw new Error('Google Auth is not enabled in Supabase');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        if (error.message.includes('provider is not enabled')) {
          throw new Error('Google login is not enabled. Contact the administrator.');
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session?.user || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
};
