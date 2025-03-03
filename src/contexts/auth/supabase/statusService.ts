/**
 * @deprecated This service is deprecated as the app now uses Firebase instead of Supabase for authentication.
 */

// Placeholder exports to fix import errors
export const statusService = {
  // Placeholder methods
  getStatus: async () => {
    console.warn('statusService is deprecated. The app now uses Firebase.');
    return null;
  },
};

export const checkGoogleAuthEnabled = async () => {
  console.warn('checkGoogleAuthEnabled is deprecated. The app now uses Firebase.');
  return false;
};
