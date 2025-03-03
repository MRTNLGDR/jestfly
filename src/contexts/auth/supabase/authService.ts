
import { supabase } from "../../../integrations/supabase/client";
import { User } from "../../../models/User";
import { statusService, checkGoogleAuthEnabled } from "./statusService";
import { profileService } from "./profileService";

/**
 * Supabase authentication service
 * 
 * Note: This service is no longer in active use as the application
 * has migrated to Firebase for authentication. This file is maintained
 * to prevent build errors.
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
      console.warn('Using supabaseAuthService.loginAndCheckAdmin, but app has migrated to Firebase');
      // Dummy implementation to avoid build errors
      throw new Error('Application uses Firebase authentication instead of Supabase');
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
      console.warn('Using supabaseAuthService.registerUser, but app has migrated to Firebase');
      // Dummy implementation to avoid build errors
      throw new Error('Application uses Firebase authentication instead of Supabase');
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
      console.warn('Using supabaseAuthService.loginWithGoogle, but app has migrated to Firebase');
      // Dummy implementation to avoid build errors
      throw new Error('Application uses Firebase authentication instead of Supabase');
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
      console.warn('Using supabaseAuthService.resetPassword, but app has migrated to Firebase');
      // Dummy implementation to avoid build errors
      throw new Error('Application uses Firebase authentication instead of Supabase');
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
      console.warn('Using supabaseAuthService.logout, but app has migrated to Firebase');
      // Dummy implementation to avoid build errors
      throw new Error('Application uses Firebase authentication instead of Supabase');
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
      console.warn('Using supabaseAuthService.getCurrentUser, but app has migrated to Firebase');
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
};
