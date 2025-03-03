
import React, { createContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { login, loginWithGoogle, register, logout, resetPassword } from './authMethods';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentUser, 
    userData, 
    loading, 
    error 
  } = useAuthState();

  const value: AuthContextType = {
    currentUser,
    userData,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    loading,
    error: error || null // Convert to string or null to match the expected type
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
