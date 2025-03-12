
import { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../models/User';
import { PermissionType } from './types';
import { fetchUserData } from './authMethods';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return {
    currentUser,
    setCurrentUser,
    userData,
    setUserData,
    loading,
    setLoading,
    error,
    setError,
    isAdmin,
    isArtist,
    hasPermission,
    refreshUserData
  };
};
