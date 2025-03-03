
import { supabase } from '../../../integrations/supabase/client';
import { loginWithCredentials, loginWithOAuth, logout, resetPassword, signUp, isGoogleAuthEnabled } from './authService';
import { fetchUserProfile, updateUserProfile } from './profileService';
import { checkSessionStatus, subscribeToAuthChanges } from './statusService';

export {
  supabase,
  loginWithCredentials,
  loginWithOAuth,
  logout,
  resetPassword,
  signUp,
  fetchUserProfile,
  updateUserProfile,
  checkSessionStatus,
  subscribeToAuthChanges,
  isGoogleAuthEnabled
};
