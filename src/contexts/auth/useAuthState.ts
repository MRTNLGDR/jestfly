
import { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../models/User';
import { PermissionType } from './types';
import { fetchUserData } from './authMethods';
import { toast } from 'sonner';
import { hasPermission, isUserAdmin, isUserArtist } from './utils/permissionUtils';
import { refreshUserSession } from './utils/sessionUtils';
import { initializeAuthState } from './utils/initAuthState';
import { logAuthDiagnostic } from './utils/diagnosticUtils';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState<Date | null>(null);

  const isAdmin = useMemo(() => isUserAdmin(userData), [userData]);
  const isArtist = useMemo(() => isUserArtist(userData), [userData]);

  const checkPermission = (requiredPermission: PermissionType | PermissionType[]) => {
    return hasPermission(userData, requiredPermission);
  };

  const refreshUserData = async () => {
    if (!currentUser) {
      console.warn("Cannot refresh user data: No current user");
      return;
    }
    
    // Prevent multiple rapid refresh attempts
    if (lastRefreshAttempt && new Date().getTime() - lastRefreshAttempt.getTime() < 2000) {
      console.log("Skipping refresh - too soon since last attempt");
      return;
    }
    
    setLastRefreshAttempt(new Date());
    
    const { user, profile, error: refreshError } = await refreshUserSession(currentUser);
    
    if (user) {
      setCurrentUser(user);
    }
    
    if (profile) {
      setUserData(profile);
      setError(null);
    } else if (refreshError) {
      setError(refreshError);
    }
  };

  // Prevent infinite loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Auth provider forced to stop loading after timeout");
        setLoading(false);
        setError("Tempo limite excedido ao carregar dados de autenticação");
        toast.error("Tempo limite excedido ao carregar dados de autenticação. Tente novamente mais tarde.");
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
          console.log("Fetching user profile after auth state change for:", user.id);
          const userProfile = await fetchUserData(user.id);
          console.log("User profile retrieved:", userProfile ? "success" : "not found");
          
          if (!userProfile) {
            console.warn("No user profile found for authenticated user");
            
            // Log diagnostic information
            await logAuthDiagnostic('No user profile found after auth state change', {
              user_id: user.id,
              event,
              timestamp: new Date().toISOString()
            });
            
            setError("Perfil de usuário não encontrado");
            toast.error("Não foi possível carregar seu perfil. Entre em contato com o suporte.");
          } else {
            setUserData(userProfile);
            setError(null);
          }
        } catch (err: any) {
          console.error("Error fetching user data after auth change:", err);
          setError("Erro ao buscar dados do usuário");
          toast.error("Erro ao buscar dados do usuário. Tente novamente mais tarde.");
          
          // Log diagnostic information
          await logAuthDiagnostic('Error fetching user profile after auth state change', {
            user_id: user.id,
            error: String(err),
            event,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Verificar o estado inicial da autenticação
    const initAuth = async () => {
      const { user, profile, error: initError } = await initializeAuthState();
      
      if (user) {
        setCurrentUser(user);
      }
      
      if (profile) {
        setUserData(profile);
      }
      
      if (initError) {
        setError(initError);
      }
      
      console.log("Auth initialization complete");
      setLoading(false);
    };

    initAuth();

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
    hasPermission: checkPermission,
    refreshUserData
  };
};
