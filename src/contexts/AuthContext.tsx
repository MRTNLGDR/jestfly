
import React from 'react';

// This file is being kept as a placeholder to avoid breaking imports.
// Authentication has been removed from the application.

export const AuthProvider = ({ children }: { children: React.ReactNode }) => children;
export const useAuth = () => ({ 
  userData: null,
  login: () => Promise.resolve(null),
  register: () => Promise.resolve(null),
  loginWithGoogle: () => Promise.resolve(null),
  logout: () => Promise.resolve(null),
  resetPassword: () => Promise.resolve(null),
  currentUser: null,
  loading: false,
  error: null
});
