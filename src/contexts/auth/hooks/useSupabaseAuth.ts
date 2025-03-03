
import { useState, useEffect } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../../integrations/supabase/client';
import { User } from '../../../models/User';
import { createSupabaseUserData, SupabaseProfileData } from '../userDataTransformer';

export interface SupabaseAuthState {
  userData: User | null;
  session: Session | null;
}

/**
 * Hook para gerenciar a autenticação com Supabase
 */
export const useSupabaseAuth = (): SupabaseAuthState & {
  error: string | null;
  setError: (error: string | null) => void;
} => {
  const [userData, setUserData] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o usuário está autenticado com o Supabase
    const checkSupabaseAuth = async () => {
      try {
        const { data: { session: supabaseSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (supabaseSession) {
          setSession(supabaseSession);
          
          // Buscar perfil do usuário no Supabase
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseSession.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            // Se não conseguir buscar o perfil, continuamos sem userData
          } else if (profileData) {
            // Buscar papéis do usuário
            const { data: rolesData, error: rolesError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', supabaseSession.user.id);
              
            if (rolesError) {
              console.error("Error fetching roles:", rolesError);
            }
            
            // Transformar os dados do Supabase para o formato da aplicação
            const roles = rolesData ? rolesData.map(r => r.role) : [];
            
            // Create a properly typed profile data object
            const profileDataWithCorrectType: SupabaseProfileData = {
              id: profileData.id,
              username: profileData.username,
              full_name: profileData.full_name,
              profile_type: profileData.profile_type as "artist" | "fan" | "admin" | "collaborator",
              avatar_url: profileData.avatar_url,
              bio: profileData.bio,
              // Ensure social_links is properly converted to Record<string, string> type
              social_links: profileData.social_links ? 
                (typeof profileData.social_links === 'string' ? 
                  JSON.parse(profileData.social_links) : 
                  profileData.social_links as Record<string, string>) : 
                {},
              // Ensure preferences is properly typed
              preferences: profileData.preferences ? 
                (typeof profileData.preferences === 'string' ? 
                  JSON.parse(profileData.preferences) : 
                  profileData.preferences) : 
                {},
              wallet_address: profileData.wallet_address,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
              roles
            };
            
            const userDataObj = createSupabaseUserData(
              { 
                email: supabaseSession.user.email || '', 
                email_confirmed_at: supabaseSession.user.email_confirmed_at 
              },
              profileDataWithCorrectType
            );
            
            setUserData(userDataObj);
          }
        }
      } catch (err) {
        console.error("Error checking Supabase auth:", err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    
    checkSupabaseAuth();
    
    // Configurar listener para mudanças de autenticação no Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        // Manipular mudanças de estado de autenticação
        if (event === 'SIGNED_IN' && session) {
          try {
            // Buscar perfil do usuário
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              return;
            }
            
            // Buscar papéis do usuário
            const { data: rolesData, error: rolesError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id);
              
            if (rolesError) {
              console.error("Error fetching roles:", rolesError);
            }
            
            // Transformar os dados do Supabase para o formato da aplicação
            const roles = rolesData ? rolesData.map(r => r.role) : [];
            
            // Create a properly typed profile data object
            const profileDataWithCorrectType: SupabaseProfileData = {
              id: profileData.id,
              username: profileData.username,
              full_name: profileData.full_name,
              profile_type: profileData.profile_type as "artist" | "fan" | "admin" | "collaborator",
              avatar_url: profileData.avatar_url,
              bio: profileData.bio,
              // Ensure social_links is properly converted to Record<string, string> type
              social_links: profileData.social_links ? 
                (typeof profileData.social_links === 'string' ? 
                  JSON.parse(profileData.social_links) : 
                  profileData.social_links as Record<string, string>) : 
                {},
              // Ensure preferences is properly typed
              preferences: profileData.preferences ? 
                (typeof profileData.preferences === 'string' ? 
                  JSON.parse(profileData.preferences) : 
                  profileData.preferences) : 
                {},
              wallet_address: profileData.wallet_address,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
              roles
            };
            
            const userDataObj = createSupabaseUserData(
              { 
                email: session.user.email || '', 
                email_confirmed_at: session.user.email_confirmed_at 
              },
              profileDataWithCorrectType
            );
            
            setUserData(userDataObj);
          } catch (err) {
            console.error("Error processing auth change:", err);
            setError(err instanceof Error ? err.message : String(err));
          }
        } else if (event === 'SIGNED_OUT') {
          setUserData(null);
        }
      }
    );
    
    // Limpar inscrição ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  return {
    userData,
    session,
    error,
    setError
  };
};
