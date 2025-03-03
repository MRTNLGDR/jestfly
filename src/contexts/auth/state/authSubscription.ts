
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../../integrations/supabase/client';
import { User as AppUser } from '../../../models/User';
import { fetchUserData } from './fetchUserData';

type AuthChangeHandler = (
  session: Session | null,
  user: User | null,
  userData: AppUser | null
) => void;

/**
 * Sets up auth state subscription
 */
export const setupAuthSubscription = (
  onAuthChange: AuthChangeHandler
): (() => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('Evento de autenticação Supabase:', event);
      
      const user = session?.user || null;
      let userData = null;
      
      if (user) {
        userData = await fetchUserData(user.id);
      }
      
      onAuthChange(session, user, userData);
    }
  );

  return () => {
    subscription.unsubscribe();
  };
};

/**
 * Gets initial session
 */
export const getInitialSession = async (): Promise<{
  session: Session | null;
  user: User | null;
  userData: AppUser | null;
}> => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;
  
  let userData = null;
  if (user) {
    userData = await fetchUserData(user.id);
  }
  
  return { session, user, userData };
};
