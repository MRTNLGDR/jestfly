
// This is a stub implementation for Supabase auth service

import { statusService } from './statusService';
import { profileService } from './profileService';

export const supabaseAuthService = {
  fetchUserProfile: profileService.fetchUserProfile,
  updateUserProfile: profileService.updateUserProfile,
  checkSessionStatus: statusService.checkSessionStatus,
  subscribeToAuthChanges: () => {
    console.warn('supabaseAuthService.subscribeToAuthChanges is a stub');
    return () => {}; // Return unsubscribe function
  }
};
