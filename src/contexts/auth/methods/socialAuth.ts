
import { supabase } from '../../../integrations/supabase/client';

/**
 * Login with Google
 */
export const loginWithGoogle = async (): Promise<void> => {
  try {
    // Use Supabase for Google login
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile`
      }
    });
    
    if (error) {
      if (error.message.includes('provider is not enabled')) {
        throw new Error('Login com Google não está habilitado. Entre em contato com o administrador.');
      }
      throw error;
    }
    
    console.log("Supabase Google login initiated:", data);
    
  } catch (err: any) {
    console.error("Google login error:", err);
    throw err;
  }
};
