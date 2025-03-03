
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, SignUpUserData } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useActivityLogger } from '@/hooks/useActivityLogger';

export const useAuthActions = (setProfile: (profile: ProfileData | null) => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logLogin, logLogout } = useActivityLogger();

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Tentando fazer login com email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Erro ao fazer login:', error);
        toast({
          title: "Falha no login",
          description: error.message,
          variant: "destructive",
        });
        logLogin(false, email);
        setLoading(false);
        return { data, error };
      }
      
      console.log('Login bem-sucedido para usuário:', data.user?.id);
      
      // Após login bem-sucedido, verificar se existe redirecionamento pendente
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        // Limpar o redirecionamento armazenado
        localStorage.removeItem('redirectAfterLogin');
        // Navegar para a página solicitada (isso deve ser feito pelo componente chamador)
      }
      
      logLogin(true, email);
      setLoading(false);
      return { data, error: null };
    } catch (error) {
      console.error('Exceção ao fazer login:', error);
      setLoading(false);
      return { data: null, error: error as Error };
    }
  };

  // Função para criar um novo usuário
  const signUp = async (email: string, password: string, userData: SignUpUserData) => {
    setLoading(true);
    try {
      console.log('Tentando registrar novo usuário com email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error('Erro ao registrar:', error);
        toast({
          title: "Falha no registro",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return { data, error };
      }
      
      console.log('Registro bem-sucedido, usuário criado:', data.user?.id);
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada com sucesso!",
        variant: "default",
      });
      
      setLoading(false);
      return { data, error: null };
    } catch (error) {
      console.error('Exceção ao registrar:', error);
      setLoading(false);
      return { data: null, error: error as Error };
    }
  };

  // Função para deslogar
  const signOut = async () => {
    try {
      console.log('Deslogando usuário');
      await logLogout();  // Registrar logout antes de efetivamente sair
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao deslogar:', error);
        toast({
          title: "Falha ao sair",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Usuário deslogado com sucesso');
      setProfile(null);
      
      toast({
        title: "Desconectado",
        description: "Você saiu da sua conta com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error('Exceção ao deslogar:', error);
    }
  };

  // Função para atualizar o perfil do usuário atual
  const refreshProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Nenhum usuário encontrado para atualizar o perfil');
        return false;
      }
      
      console.log('Atualizando perfil para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil atualizado:', error);
        return false;
      }
      
      if (data) {
        console.log('Perfil atualizado:', data);
        // Convertendo explicitamente o objeto data para ProfileData
        const profileData: ProfileData = {
          id: data.id,
          email: data.email,
          display_name: data.display_name,
          username: data.username,
          profile_type: data.profile_type,
          avatar: data.avatar,
          bio: data.bio,
          created_at: data.created_at,
          updated_at: data.updated_at,
          last_login: data.last_login,
          wallet_address: data.wallet_address,
          roles: data.roles,
          permissions: data.permissions,
          is_verified: data.is_verified,
          social_links: data.social_links as Record<string, string> | null,
          preferences: data.preferences,
          two_factor_enabled: data.two_factor_enabled
        };
        setProfile(profileData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Exceção ao atualizar perfil:', error);
      return false;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    refreshProfile,
    loading
  };
};
