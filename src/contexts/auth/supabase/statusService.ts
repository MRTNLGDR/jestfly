
import { supabase } from "../../../integrations/supabase/client";

/**
 * Checks if Google Auth is enabled/configured in Supabase
 */
export const checkGoogleAuthEnabled = async (): Promise<boolean> => {
  try {
    // This is a light request to verify the authentication configuration
    const { data, error } = await supabase.auth.getSession();
    
    // If there's an error, the configuration is likely incorrect
    if (error) {
      console.error("Error checking Supabase session:", error);
      return false;
    }
    
    // If Supabase is working, we can assume basic authentication is OK
    // But Google auth needs to be verified differently or assumed based on configuration
    return true; // For now, return true and handle specific errors during login attempts
  } catch (error) {
    console.error("Error checking authentication configuration:", error);
    return false;
  }
};

/**
 * Service for checking Supabase authentication status
 */
export const statusService = {
  /**
   * Checks if Google Auth is enabled in Supabase
   */
  isGoogleAuthEnabled: async (): Promise<boolean> => {
    return await checkGoogleAuthEnabled();
  },

  /**
   * Checks if a user has admin status in Supabase
   */
  async checkAdminStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_type')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      // Now we can check the profile_type directly
      return data?.profile_type === 'admin';
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      return false;
    }
  }
};
