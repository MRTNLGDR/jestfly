
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { User } from '../../models/User';
import { AuthContextType } from './types';
import { toast } from 'sonner';
import { fetchUserProfile, updateUserProfile } from './supabase/profileService';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setCurrentUser(session?.user || null);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const userProfile = await fetchUserProfile(session.user.id);
          setUserData(userProfile);
        }
      } catch (err: any) {
        console.error("Error checking session:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setCurrentUser(session?.user || null);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const userProfile = await fetchUserProfile(session.user.id);
          setUserData(userProfile);
          
          // Update last login if user just signed in
          if (event === 'SIGNED_IN' && userProfile) {
            await updateUserProfile(userProfile.id, {
              lastLogin: new Date()
            });
          }
        } else {
          setUserData(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      });
      
      if (error) throw error;
      
      // User data is handled in the auth state change listener
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // User data is handled in the auth state change listener
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null);
      
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: userData.displayName,
            username: userData.username,
            profileType: userData.profileType
          }
        }
      });
      
      if (error) throw error;
      
      // Profile creation is handled by the database trigger
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserData(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast.success('Instruções de recuperação de senha enviadas para seu email');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    userData,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    loading,
    error,
    session
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
