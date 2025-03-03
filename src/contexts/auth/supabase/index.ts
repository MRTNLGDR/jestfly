
import { supabase } from '../../../integrations/supabase/client';
import { loginWithCredentials, loginWithOAuth, logout, resetPassword, signUp } from './authService';
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
  subscribeToAuthChanges
};
