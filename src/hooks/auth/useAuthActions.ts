import { useState } from 'react';
import { useSignIn } from './useSignIn';
import { useSignUp } from './useSignUp';
import { useSignOut } from './useSignOut';
import { useProfileRefresh } from './useProfileRefresh';

export const useAuthActions = (setProfile: (profile: any) => void) => {
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useSignIn(setProfile);
  const { signUp } = useSignUp(setProfile);
  const { signOut } = useSignOut(setProfile);
  const { refreshProfile } = useProfileRefresh(setProfile);

  return {
    signIn,
    signUp,
    signOut,
    refreshProfile,
    loading
  };
};
