
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../../models/User';
import { supabase } from '../../integrations/supabase/client';
import { 
  loginUser,
  registerUser,
  logoutUser,
  resetUserPassword,
  updateUserProfile,
  fetchUserData
} from './authMethods';

export const authService = {
  loginUser,
  registerUser,
  logoutUser,
  resetUserPassword,
  updateUserProfile,
  fetchUserData,
  
  getCurrentUser: async (): Promise<SupabaseUser | null> => {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  },
  
  onAuthStateChanged: (callback: (user: SupabaseUser | null) => void) => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user || null);
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }
};
