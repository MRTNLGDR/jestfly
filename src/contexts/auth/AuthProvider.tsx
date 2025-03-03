
import React, { createContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './authStateManager';
import { 
  login, 
  loginWithGoogle, 
  register, 
  logout, 
  resetPassword 
} from './authMethods';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    session,
    user,
    userData, 
    loading, 
    error 
  } = useAuthState();

  const value: AuthContextType = {
    session,
    user,
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
