
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { User as AppUser } from '../../models/User';
import { createSupabaseUserData } from './userDataTransformer';

/**
 * Hook personalizado para gerenciar o estado da autenticação
 */
export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar dados do usuário do Supabase
  const fetchUserData = async (userId: string) => {
    try {
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        return;
      }

      // Buscar roles do usuário
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Erro ao buscar roles:', rolesError);
      }
      
      // Obter email da sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!profile || !session?.user) {
        return;
      }
      
      // Converter campos JSON se necessário
      const parsedPreferences = typeof profile.preferences === 'string' 
        ? JSON.parse(profile.preferences) 
        : (profile.preferences || {});
        
      const parsedSocialLinks = typeof profile.social_links === 'string'
        ? JSON.parse(profile.social_links)
        : (profile.social_links || {});
      
      // Criar perfil completo com roles
      const profileWithRoles = {
        ...profile,
        profile_type: (profile.profile_type || 'fan') as 'artist' | 'fan' | 'admin' | 'collaborator',
        preferences: parsedPreferences,
        social_links: parsedSocialLinks,
        roles: roles?.map(r => r.role) || []
      };
      
      // Transformar dados para o modelo User da aplicação
      const supabaseAuthUser = {
        email: session.user.email || '',
        email_confirmed_at: session.user.email_confirmed_at
      };
      
      const user = createSupabaseUserData(
        supabaseAuthUser,
        profileWithRoles
      );

      setUserData(user);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário do Supabase:", err);
    }
  };

  useEffect(() => {
    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Ouvir mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Evento de autenticação Supabase:', event);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, userData, setUserData, loading, error, setError };
};
