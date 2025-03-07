
import React, { createContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useAuthActions } from '@/hooks/auth/useAuthActions';

// Update the ProfileData interface with the specific profile_type values
export interface ProfileData {
  id?: string;
  email?: string;
  display_name?: string;
  username?: string;
  profile_type?: 'fan' | 'artist' | 'admin' | 'collaborator';
  bio?: string;
  avatar?: string;
  wallet_address?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  is_verified?: boolean;
  two_factor_enabled?: boolean;
  preferences?: any;
}

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: ProfileData | null;
  isLoading: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{error?: Error}>;
  signUp: (email: string, password: string, userData?: Partial<ProfileData>) => Promise<{error?: Error}>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<{avatarUrl: string}>;
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  loading: false,
  signIn: async () => ({error: undefined}),
  signUp: async () => ({error: undefined}),
  signOut: async () => {},
  updateProfile: async () => {},
  uploadAvatar: async () => ({avatarUrl: ''})
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    fetchProfile, 
    signIn: authSignIn, 
    signUp: authSignUp, 
    signOut: authSignOut,
    updateProfile: authUpdateProfile,
    uploadAvatar: authUploadAvatar
  } = useAuthActions();

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          fetchProfile(session.user.id)
            .then(profileData => {
              setProfile(profileData);
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("Error getting session:", error);
        setIsLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    if (result.profile) {
      setProfile(result.profile);
    }
    return { error: result.error };
  };

  const signUp = async (email: string, password: string, userData?: Partial<ProfileData>) => {
    return await authSignUp(email, password, userData);
  };

  const signOut = async () => {
    const success = await authSignOut();
    if (success) {
      setProfile(null);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user || !profile) return;
    
    const success = await authUpdateProfile(data, user.id, profile);
    if (success) {
      setProfile({ ...profile, ...data });
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) throw new Error('Você precisa estar logado para fazer upload de avatar');
    
    const result = await authUploadAvatar(file, user.id);
    if (result.avatarUrl) {
      await updateProfile({ avatar: result.avatarUrl });
    }
    return result;
  };

  const value: AuthContextProps = { 
    session, 
    user, 
    profile, 
    isLoading, 
    loading: isLoading, 
    signIn, 
    signUp, 
    signOut, 
    updateProfile,
    uploadAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
