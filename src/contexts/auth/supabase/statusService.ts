
/**
 * Supabase Status Service
 * 
 * This file is a placeholder to fix build errors.
 * The application now uses Firebase for authentication instead of Supabase.
 */

export const statusService = {
  isGoogleAuthEnabled: async (): Promise<boolean> => {
    console.warn('Using statusService.isGoogleAuthEnabled with Supabase, but app has migrated to Firebase');
    return true;
  },
  
  checkAdminStatus: async (userId: string): Promise<boolean> => {
    console.warn('Using statusService.checkAdminStatus with Supabase, but app has migrated to Firebase');
    return false;
  },
  
  checkGoogleAuthEnabled: async (): Promise<boolean> => {
    console.warn('Using statusService.checkGoogleAuthEnabled with Supabase, but app has migrated to Firebase');
    return true;
  }
};

export const checkGoogleAuthEnabled = async (): Promise<boolean> => {
  console.warn('Using checkGoogleAuthEnabled with Supabase, but app has migrated to Firebase');
  return true;
};
