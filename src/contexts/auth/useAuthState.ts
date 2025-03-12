
import { useState, useEffect, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../models/User';
import { PermissionType } from './types';
import { fetchUserData } from './authMethods';
import { toast } from 'sonner';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState<Date | null>(null);

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
    
    try {
      console.log("Refreshing user data for:", currentUser.id);
      
      // First refresh the session to ensure we have the latest token
      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
      
      if (sessionError) {
        console.error("Session refresh failed:", sessionError);
        toast.error("Falha ao atualizar sessão. Tente fazer login novamente.");
        return;
      }
      
      if (!sessionData.session) {
        console.warn("No session after refresh");
        setCurrentUser(null);
        setUserData(null);
        return;
      }
      
      setCurrentUser(sessionData.session.user);
      
      // Now get the latest user profile data
      const refreshedData = await fetchUserData(sessionData.session.user.id);
      
      if (refreshedData) {
        console.log("User data refreshed successfully:", refreshedData.display_name);
        setUserData(refreshedData);
        setError(null);
      } else {
        console.warn("Failed to refresh user data - no data returned from fetchUserData");
        toast.error("Dados do usuário não encontrados. Entre em contato com o suporte.");
        setError("Perfil de usuário não encontrado");
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
      toast.error("Não foi possível atualizar os dados do usuário. Tente novamente mais tarde.");
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
            try {
              const { error } = await supabase.rpc('log_auth_diagnostic', {
                message: 'No user profile found after auth state change',
                metadata: {
                  user_id: user.id,
                  event,
                  timestamp: new Date().toISOString()
                }
              });
              
              if (error) {
                console.error("Failed to log diagnostic:", error);
              }
            } catch (logError) {
              console.error("Exception logging diagnostic:", logError);
            }
            
            setError("Perfil de usuário não encontrado");
            toast.error("Não foi possível carregar seu perfil. Entre em contato com o suporte.");
          } else {
            setUserData(userProfile);
            setError(null);
          }
        } catch (err) {
          console.error("Error fetching user data after auth change:", err);
          setError("Erro ao buscar dados do usuário");
          toast.error("Erro ao buscar dados do usuário. Tente novamente mais tarde.");
          
          // Log diagnostic information
          try {
            const { error } = await supabase.rpc('log_auth_diagnostic', {
              message: 'Error fetching user profile after auth state change',
              metadata: {
                user_id: user.id,
                error: String(err),
                event,
                timestamp: new Date().toISOString()
              }
            });
            
            if (error) {
              console.error("Failed to log diagnostic:", error);
            }
          } catch (logError) {
            console.error("Exception logging diagnostic:", logError);
          }
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setLoading(false);
          toast.error("Erro ao verificar sessão: " + sessionError.message);
          return;
        }
        
        console.log("Initial session:", session ? "exists" : "none");
        
        const user = session?.user ?? null;
        setCurrentUser(user);
        
        if (user) {
          console.log("Fetching initial user profile for:", user.id);
          try {
            const userProfile = await fetchUserData(user.id);
            
            if (userProfile) {
              console.log("Initial user profile loaded successfully:", userProfile.display_name);
              setUserData(userProfile);
              setError(null);
              
              // Log successful auth initialization for diagnostics
              try {
                const { error } = await supabase.rpc('log_auth_diagnostic', {
                  message: 'Auth initialization successful',
                  metadata: {
                    user_id: user.id,
                    profile_type: userProfile.profile_type,
                    timestamp: new Date().toISOString()
                  }
                });
                
                if (error) {
                  console.error("Failed to log diagnostic:", error);
                }
              } catch (logError) {
                console.error("Exception logging diagnostic:", logError);
              }
            } else {
              console.warn("No user profile found for authenticated user on initialization");
              setError("Perfil de usuário não encontrado");
              toast.error("Não foi possível carregar seu perfil. Entre em contato com o suporte.");
              
              // Log diagnostic information
              try {
                const { error } = await supabase.rpc('log_auth_diagnostic', {
                  message: 'No user profile found during auth initialization',
                  metadata: {
                    user_id: user.id,
                    timestamp: new Date().toISOString()
                  }
                });
                
                if (error) {
                  console.error("Failed to log diagnostic:", error);
                }
              } catch (logError) {
                console.error("Exception logging diagnostic:", logError);
              }
            }
          } catch (profileError) {
            console.error("Error fetching initial profile:", profileError);
            setError("Erro ao buscar perfil inicial");
            toast.error("Erro ao buscar seu perfil. Tente novamente mais tarde.");
            
            // Log diagnostic information
            try {
              const { error } = await supabase.rpc('log_auth_diagnostic', {
                message: 'Error fetching initial profile',
                metadata: {
                  user_id: user.id,
                  error: String(profileError),
                  timestamp: new Date().toISOString()
                }
              });
              
              if (error) {
                console.error("Failed to log diagnostic:", error);
              }
            } catch (logError) {
              console.error("Exception logging diagnostic:", logError);
            }
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError("Erro ao inicializar autenticação");
        toast.error("Erro ao inicializar autenticação. Recarregue a página.");
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
