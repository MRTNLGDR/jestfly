
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    userData,
    loading,
    error,
    setError,
    setUserData,
    isAdmin,
    isArtist,
    hasPermission,
    refreshUserData
  } = useAuthState();

  const {
    login,
    register,
    logout,
    resetPassword,
    updateProfile
  } = useAuthMethods({
    currentUser,
    userData,
    setUserData,
    setError
  });

  const value: AuthContextType = {
    currentUser,
    userData,
    login,
    register,
    logout,
    resetPassword,
    loading,
    error,
    updateProfile,
    refreshUserData,
    isAdmin,
    isArtist,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
