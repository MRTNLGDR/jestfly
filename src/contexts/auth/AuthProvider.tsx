
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a mock authenticated user
  const mockUser = {
    id: 'mock-user-id',
    email: 'user@example.com',
  };

  // Create mock user data
  const mockUserData = {
    id: 'mock-user-id',
    email: 'user@example.com',
    username: 'user',
    display_name: 'Demo User',
    bio: 'This is a demo user account',
    avatar_url: '',
    followers_count: 0,
    following_count: 0,
    created_at: new Date().toISOString(),
    profile_type: 'admin' as const,
    is_verified: true,
  };

  // Create mock context values with no-op functions
  const value: AuthContextType = {
    currentUser: mockUser,
    userData: mockUserData,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    resetPassword: async () => {},
    loading: false,
    error: null,
    updateProfile: async () => {},
    refreshUserData: async () => {},
    isAdmin: true,
    isArtist: true,
    hasPermission: () => true
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
