
import { supabase } from "../../../integrations/supabase/client";

/**
 * Check if Google Auth is enabled
 */
export const checkGoogleAuthEnabled = async (): Promise<boolean> => {
  try {
    // This is a light request to check authentication configuration
    const { data, error } = await supabase.auth.getSession();
    
    // If there's an error, configuration is likely wrong
    if (error) {
      console.error("Error checking Supabase session:", error);
      return false;
    }
    
    // If supabase is working, we can assume basic authentication is ok
    // But Google auth needs to be verified another way or assumed based on configuration
    return true; // For now, we return true and handle specific errors when trying to login
  } catch (error) {
    console.error("Error checking authentication configuration:", error);
    return false;
  }
};

/**
 * Status checking service for Supabase
 */
export const statusService = {
  /**
   * Check if Google Auth is enabled
   */
  isGoogleAuthEnabled: async (): Promise<boolean> => {
    return await checkGoogleAuthEnabled();
  },

  /**
   * Check if user is an admin in Supabase
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

      return data?.profile_type === 'admin';
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      return false;
    }
  }
};
