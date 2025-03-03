
import React, { createContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, firestore } from '../../firebase/config';
import { User } from '../../models/User';
import { AuthContextType } from './types';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as User);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await setDoc(doc(firestore, 'users', result.user.uid), 
        { lastLogin: new Date() }, 
        { merge: true }
      );
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      
      // Use Supabase for Google login instead of Firebase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error("Supabase Google login error:", error);
        throw error;
      }
      
      // Note: The auth state will be handled by Supabase's auth listener 
      // and the user will be redirected back to the app after authentication
      console.log("Supabase Google login initiated:", data);
      
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>): Promise<void> => {
    try {
      setError(null);
      
      // Use Supabase for registration instead of Firebase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.displayName,
            username: userData.username,
            profile_type: userData.profileType,
            admin_code: userData.adminCode
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error("Supabase registration error:", error);
        throw error;
      }
      
      console.log("Supabase registration success:", data);
      
      // Return immediately as the user will need to verify their email
      // Profiles will be created automatically via Supabase trigger
      return;
      
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Also sign out from Supabase if we're using it
      await supabase.auth.signOut();
      await signOut(auth);
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      
      // Use Supabase for password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Instruções para redefinir senha foram enviadas para o seu email');
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message);
      throw err;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
