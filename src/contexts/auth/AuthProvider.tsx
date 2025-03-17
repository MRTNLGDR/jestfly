
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './state/useAuthState';
import { useAuthMethods } from './useAuthMethods';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usar o hook de estado real em vez de mock
  const authState = useAuthState();
  
  // Usar os métodos reais de autenticação
  const authMethods = useAuthMethods({
    currentUser: authState.currentUser,
    userData: authState.userData,
    setUserData: authState.setUserData,
    setError: authState.setError
  });
  
  // Combinar o estado e os métodos em um único objeto de contexto
  const value: AuthContextType = {
    ...authState,
    ...authMethods
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
