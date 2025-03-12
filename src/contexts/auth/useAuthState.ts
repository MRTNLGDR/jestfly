
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
        console.log("User data refreshed successfully:", refreshedData.display_name);
        setUserData(refreshedData);
      } else {
        console.warn("Failed to refresh user data - no data returned from fetchUserData");
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
          setUserData(userProfile);
          if (!userProfile) {
            console.warn("No user profile found for authenticated user");
            setError("Perfil de usuário não encontrado");
            toast.error("Não foi possível carregar seu perfil. Entre em contato com o suporte.");
          }
        } catch (err) {
          console.error("Error fetching user data after auth change:", err);
          setError("Erro ao buscar dados do usuário");
          toast.error("Erro ao buscar dados do usuário. Tente novamente mais tarde.");
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
            } else {
              console.warn("No user profile found for authenticated user on initialization");
              setError("Perfil de usuário não encontrado");
              toast.error("Não foi possível carregar seu perfil. Entre em contato com o suporte.");
            }
          } catch (profileError) {
            console.error("Error fetching initial profile:", profileError);
            setError("Erro ao buscar perfil inicial");
            toast.error("Erro ao buscar seu perfil. Tente novamente mais tarde.");
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
