
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../models/User';
import { AuthContextType, PermissionType } from './types';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  resetUserPassword,
  updateUserProfile,
  fetchUserData
} from './authMethods';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Prevent infinite loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Auth provider forced to stop loading after timeout");
        setLoading(false);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, [loading]);

  const isAdmin = useMemo(() => {
    return userData?.profile_type === 'admin';
  }, [userData]);

  const isArtist = useMemo(() => {
    return userData?.profile_type === 'artist';
  }, [userData]);

  const hasPermission = (requiredPermission: PermissionType | PermissionType[]) => {
    if (!userData) return false;
    
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.includes(userData.profile_type as PermissionType);
    }
    
    return userData.profile_type === requiredPermission;
  };

  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      console.log("Refreshing user data for:", currentUser.id);
      const refreshedData = await fetchUserData(currentUser.id);
      if (refreshedData) {
        setUserData(refreshedData);
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Configurar o listener de mudança de estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      const user = session?.user ?? null;
      setCurrentUser(user);
      
      if (user) {
        try {
          console.log("Fetching user profile after auth state change");
          const userProfile = await fetchUserData(user.id);
          setUserData(userProfile);
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Verificar o estado inicial da autenticação
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session ? "exists" : "none");
        
        const user = session?.user ?? null;
        setCurrentUser(user);
        
        if (user) {
          console.log("Fetching initial user profile");
          const userProfile = await fetchUserData(user.id);
          setUserData(userProfile);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        console.log("Auth initialization complete");
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      console.log("Cleaning up auth listener");
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await loginUser(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      setError(null);
      await registerUser(email, password, userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await resetUserPassword(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userData) {
      throw new Error("Usuário não autenticado");
    }

    try {
      await updateUserProfile(currentUser.id, data);
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    userData,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    resetPassword: resetUserPassword,
    loading,
    error,
    updateProfile: updateUserProfile,
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
