
import { User } from '../../../models/User';
import { supabase } from '../../../integrations/supabase/client';
import { fetchUserProfile } from './profileService';
import { type Session } from '@supabase/supabase-js';

export const checkSessionStatus = async (): Promise<{ user: User | null; session: Session | null }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { user: null, session: null };
    }
    
    const user = await fetchUserProfile(session.user.id);
    return { user, session };
  } catch (error) {
    console.error('Error checking session status:', error);
    return { user: null, session: null };
  }
};

export const subscribeToAuthChanges = (
  callback: (user: User | null, session: Session | null) => void
) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const user = await fetchUserProfile(session.user.id);
        callback(user, session);
      } else {
        callback(null, null);
      }
    }
  );
  
  return subscription;
};

export const checkGoogleAuthEnabled = async (): Promise<boolean> => {
  // Em um cenário real, poderíamos verificar isso nas configurações do sistema
  // Por enquanto, vamos assumir que o login com Google está sempre ativado
  return true;
};
