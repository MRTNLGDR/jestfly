
/**
 * @deprecated This service is deprecated as the app now uses Firebase instead of Supabase for authentication.
 */

import { supabase } from '../../../integrations/supabase/client';
import { statusService, checkGoogleAuthEnabled } from './statusService';
import { profileService } from './profileService';

export const authService = {
  // Placeholder methods with warnings
  login: async () => {
    console.warn('authService is deprecated. The app now uses Firebase.');
    return null;
  },
  logout: async () => {
    console.warn('authService is deprecated. The app now uses Firebase.');
    return null;
  },
  register: async () => {
    console.warn('authService is deprecated. The app now uses Firebase.');
    return null;
  },
};
