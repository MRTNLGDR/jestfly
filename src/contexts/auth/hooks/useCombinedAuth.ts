
import { useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { useFirebaseAuth } from './useFirebaseAuth';
import { useSupabaseAuth } from './useSupabaseAuth';
import { AuthStateHook } from '../useAuthState';

/**
 * Hook that combines Firebase and Supabase authentication
 */
export const useCombinedAuth = (): AuthStateHook => {
  const { currentUser, firebaseUserData } = useFirebaseAuth();
  const { userData: supabaseUserData, session, error: supabaseError, setError } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  
  // Determine which user data to use (prioritize Supabase)
  const userData = supabaseUserData || firebaseUserData;
  
  // Control loading state
  if ((currentUser !== null || session !== null) && loading) {
    setLoading(false);
  }
  
  // Create a combined return value that properly includes all SupabaseClient properties
  return {
    currentUser,
    userData,
    session,
    loading,
    error: supabaseError,
    ...supabase
  } as AuthStateHook;
};
