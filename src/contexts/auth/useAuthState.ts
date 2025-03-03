
import { User as FirebaseUser } from 'firebase/auth';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { User } from '../../models/User';
import { supabase } from '../../integrations/supabase/client';
import { useCombinedAuth } from './hooks/useCombinedAuth';

export type AuthStateHook = {
  currentUser: FirebaseUser | null;
  userData: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
} & SupabaseClient<any, "public", any>;

/**
 * Hook para gerenciar o estado de autenticação com Firebase e Supabase
 */
export const useAuthState = (): AuthStateHook => {
  return useCombinedAuth();
};
