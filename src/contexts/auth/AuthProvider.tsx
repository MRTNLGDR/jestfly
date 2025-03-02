
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { User } from '../../models/User';
import { AuthContextType } from './types';
import { authService } from './authService';

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
        // Fetch user data from Firestore
        try {
          console.log("Fetching user data for:", user.uid);
          const userData = await authService.getUserData(user.uid);
          
          // Special case for admin user
          const isAdminEmail = user.email === 'lucas@martynlegrand.com';
          
          if (userData) {
            // Auto-assign admin role for specific email if not already set
            if (isAdminEmail && userData.profileType !== 'admin') {
              await authService.updateUserToAdmin(user.uid);
              userData.profileType = 'admin';
            }
            
            console.log("User data found:", userData);
            setUserData(userData);
          } else if (isAdminEmail) {
            // Create admin user if doesn't exist
            const adminUserData = await authService.createAdminUser(user);
            setUserData(adminUserData);
          } else {
            console.log("No user data found");
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

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await authService.login(email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      await authService.loginWithGoogle();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setError(null);
      await authService.register(email, password, userData);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await authService.resetPassword(email);
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
