
// Supabase auth services index

import { fetchUserProfile, updateUserProfile } from './profileService';
import { checkSessionStatus, subscribeToAuthChanges, checkGoogleAuthEnabled } from './statusService';

// Export placeholders to prevent import errors
export const supabaseAuthService = {
  fetchUserProfile,
  updateUserProfile,
  checkSessionStatus,
  subscribeToAuthChanges,
  isGoogleAuthEnabled: async () => await checkGoogleAuthEnabled()
};
