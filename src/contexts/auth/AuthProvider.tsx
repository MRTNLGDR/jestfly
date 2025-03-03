
import React, { createContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { 
  login, 
  loginWithGoogle, 
  register, 
  logout, 
  resetPassword,
  verifyAdminCode,
  updateUserProfile
} from './methods';

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
    verifyAdminCode,
    updateUserProfile,
    loading,
    error: error || null // Converte para string ou null para corresponder ao tipo esperado
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
