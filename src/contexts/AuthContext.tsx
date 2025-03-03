
import React, { createContext, useContext } from 'react';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useAuthActions } from '@/hooks/auth/useAuthActions';
import { useProfile } from '@/hooks/auth/useProfile';
import { useAvatar } from '@/hooks/auth/useAvatar';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Obter estado de autenticação
  const { user, profile, session, loading, setProfile } = useAuthState();
  
  // Obter ações de autenticação
  const { signIn, signUp, signOut, refreshProfile, loading: actionLoading } = useAuthActions(setProfile);
  
  // Obter funções de gerenciamento de perfil
  const { updateProfile, updating } = useProfile(user, setProfile);
  
  // Obter funções de gerenciamento de avatar
  const { uploadAvatar, uploading } = useAvatar(user, updateProfile);

  // Combinar loading states
  const isLoading = loading || actionLoading || updating || uploading;

  // Combinar todos os valores para o context
  const value = {
    user,
    session,
    profile,
    loading: isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
