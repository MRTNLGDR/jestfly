
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SignUpUserData } from '@/types/auth';

export const useAuthActions = (setProfile: any) => {
  const [loading, setLoading] = useState(false);

  // Sign in com email/senha
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Registro de novos usuários
  const signUp = async (email: string, password: string, userData: SignUpUserData) => {
    try {
      setLoading(true);
      
      // Criar usuário na auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!error && data.user) {
        // Criar perfil para o usuário
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          username: userData.username,
          display_name: userData.display_name,
          profile_type: userData.profile_type,
        });
        
        // Buscar o perfil completo que acabou de ser criado
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileData) {
          setProfile(profileData);
        }
      }

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil
  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data) {
        setProfile(data);
        return true;
      }
    }
    
    return false;
  };

  return {
    signIn,
    signUp,
    signOut,
    refreshProfile,
    loading
  };
};
