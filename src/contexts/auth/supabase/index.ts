
// This file is a placeholder for Supabase auth services index
// which has been deprecated in favor of Firebase auth

import { profileService } from './profileService';
import { statusService, checkGoogleAuthEnabled } from './statusService';

// Export placeholders to prevent import errors
export const supabaseAuthService = {
  fetchUserProfile: profileService.fetchUserProfile,
  updateUserProfile: profileService.updateUserProfile,
  checkSessionStatus: statusService.checkSessionStatus,
  subscribeToAuthChanges: () => {
    console.warn('supabaseAuthService.subscribeToAuthChanges is a stub');
    return () => {}; // Return unsubscribe function
  },
  isGoogleAuthEnabled: async () => {
    return await checkGoogleAuthEnabled();
  }
};
