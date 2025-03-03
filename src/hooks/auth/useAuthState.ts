
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { ProfileData } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      console.log(`Buscando perfil para userId: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      
      console.log('Perfil recuperado:', data);
      return data as ProfileData;
    } catch (error) {
      console.error('Exceção ao buscar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    // Obter sessão inicial
    console.log('Verificando sessão inicial');
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Sessão inicial:', session?.user?.id || 'Nenhuma sessão');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('Usuário encontrado na sessão inicial, buscando perfil');
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
        console.log('Perfil definido após sessão inicial:', profileData?.id || 'Perfil não encontrado');
      }
      
      setLoading(false);
    });

    // Monitorar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Evento de autenticação:', _event, 'ID do usuário:', session?.user?.id || 'Nenhum usuário');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('Perfil sendo buscado após mudança de estado de autenticação');
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
        console.log('Perfil definido após mudança de autenticação:', profileData?.id || 'Perfil não encontrado');
      } else {
        setProfile(null);
        console.log('Perfil removido após logout/expiração de sessão');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    profile,
    session,
    loading,
    setProfile
  };
};
