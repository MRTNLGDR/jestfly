
/**
 * Supabase Profile Service
 * 
 * This file is a placeholder to fix build errors.
 * The application now uses Firebase for authentication instead of Supabase.
 */

import { User } from "../../../models/User";

export const profileService = {
  syncUserProfile: async (userId: string, userData: Partial<User>): Promise<void> => {
    console.warn('Using profileService.syncUserProfile with Supabase, but app has migrated to Firebase');
  },
  
  getUserProfile: async (userId: string): Promise<User | null> => {
    console.warn('Using profileService.getUserProfile with Supabase, but app has migrated to Firebase');
    return null;
  }
};
