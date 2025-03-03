
// This file is a placeholder for Supabase auth services index
// which has been deprecated in favor of Firebase auth

import { fetchUserProfile, updateUserProfile } from './profileService';
import { checkSessionStatus, subscribeToAuthChanges } from './statusService';

// Export placeholders to prevent import errors
export const supabaseAuthService = {
  fetchUserProfile,
  updateUserProfile,
  checkSessionStatus,
  subscribeToAuthChanges
};
