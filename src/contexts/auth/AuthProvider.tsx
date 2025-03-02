
import React, { createContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { User } from '../../models/User';
import { AuthContextType } from './types';
import { handleAuthStateChange } from './authStateManager';
import { 
  login as loginService,
  loginWithGoogle as loginWithGoogleService,
  register as registerService,
  logout as logoutService,
  resetPassword as resetPasswordService
} from './authMethods';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = handleAuthStateChange({
      setCurrentUser,
      setUserData,
      setLoading
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await loginService(email, password, setUserData);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      await loginWithGoogleService(setUserData);
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null);
      await registerService(email, password, userData, setUserData);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await resetPasswordService(email);
    } catch (err: any) {
      console.error("Password reset error:", err);
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
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
