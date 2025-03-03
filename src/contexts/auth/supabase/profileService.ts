
import { supabase } from "../../../integrations/supabase/client";
import { User } from "../../../models/User";
import { toast } from "sonner";

/**
 * Profile management service for Supabase
 */
export const profileService = {
  /**
   * Create or update user profile in Supabase
   */
  async syncUserProfile(userId: string, userData: Partial<User>): Promise<void> {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            username: userData.username,
            full_name: userData.displayName,
            profile_type: userData.profileType,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: userData.username,
            full_name: userData.displayName,
            profile_type: userData.profileType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Error syncing profile with Supabase:', error);
      toast.error('Error updating profile: ' + error.message);
    }
  },

  /**
   * Get user profile from Supabase
   */
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
};
