
import { auth } from '../../../firebase/config';
import { supabase } from '../../../integrations/supabase/client';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Also sign out from Firebase for backward compatibility
    await signOut(auth);
    
    toast.success('Logout realizado com sucesso');
  } catch (err: any) {
    console.error("Logout error:", err);
    throw err;
  }
};
