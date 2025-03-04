
import React, { createContext, useContext } from 'react';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';
import { useAuthMethods } from '@/hooks/auth/useAuthMethods';
import { AuthContextType } from '@/types/auth';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook for using auth context
const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, profile, loading, setProfile, parseProfileData } = useAuthProvider();
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    updateProfile, 
    uploadAvatar, 
    refreshProfile 
  } = useAuthMethods(user, parseProfileData, setProfile);

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the hook for use in components
export const useAuth = useAuthContext;
