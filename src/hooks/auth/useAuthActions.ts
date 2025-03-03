
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { SignUpUserData } from '@/types/auth';

export const useAuthActions = (setProfile: (profile: any) => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      return data;
    } catch (error) {
      console.error('Exceção ao buscar perfil:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('Atualizando dados do perfil para usuário:', user.id);
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        console.log('Perfil atualizado com sucesso:', profileData);
        setProfile(profileData);
      } else {
        console.warn('Não foi possível atualizar o perfil do usuário:', user.id);
      }
    } else {
      console.log('Tentativa de atualizar perfil sem usuário autenticado');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Tentando login com email: ${email}`);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Erro de autenticação:', error.message, error);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return { data: null, error };
      }
      
      if (data.user) {
        console.log('Login bem-sucedido:', data.user.id);
        
        // Buscar perfil após login
        const profileData = await fetchProfile(data.user.id);
        if (profileData) {
          console.log('Perfil recuperado após login:', profileData.profile_type);
          setProfile(profileData);
        
          // Verificar o tipo de perfil e redirecionar adequadamente
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo, ${profileData.display_name}!`,
            variant: "default",
          });
          
          if (profileData.profile_type === 'admin') {
            console.log('Redirecionando para painel de admin');
            navigate('/admin');
          } else {
            console.log('Redirecionando para página inicial');
            navigate('/');
          }
        } else {
          console.error('Perfil não encontrado após login bem-sucedido');
          toast({
            title: "Perfil não encontrado",
            description: "Seu login foi bem-sucedido, mas não encontramos seu perfil.",
            variant: "destructive",
          });
          navigate('/');
        }
      }
      
      setLoading(false);
      return { data: data?.user ?? null, error: null };
    } catch (error) {
      console.error('Exceção durante login:', error);
      const err = error as Error;
      toast({
        title: "Erro ao fazer login",
        description: err.message,
        variant: "destructive",
      });
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const signUp = async (email: string, password: string, userData: SignUpUserData) => {
    try {
      setLoading(true);
      console.log('Iniciando registro com email:', email, 'e dados:', userData);
      
      // Registrar o usuário
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            display_name: userData.display_name,
            username: userData.username,
            profile_type: userData.profile_type
          }
        }
      });
      
      if (error) {
        console.error('Erro no registro:', error);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return { data: null, error };
      }
      
      if (data.user) {
        console.log('Registro bem-sucedido, usuário criado:', data.user.id);
        
        // Verificar se o perfil foi criado automaticamente pelo trigger
        setTimeout(async () => {
          const profileData = await fetchProfile(data.user!.id);
          if (profileData) {
            console.log('Perfil encontrado após registro:', profileData);
            setProfile(profileData);
          } else {
            console.warn('Perfil não encontrado após registro, pode haver um atraso na criação');
          }
        }, 1000); // Pequeno atraso para dar tempo ao trigger
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu e-mail para confirmar o cadastro.",
          variant: "default",
        });
        
        navigate('/');
      }
      
      setLoading(false);
      return { data: data?.user ?? null, error: null };
    } catch (error) {
      console.error('Exceção durante registro:', error);
      const err = error as Error;
      toast({
        title: "Erro ao criar conta",
        description: err.message,
        variant: "destructive",
      });
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      console.log('Realizando logout');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
        toast({
          title: "Erro ao fazer logout",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setProfile(null);
        console.log('Logout bem-sucedido, perfil removido');
        toast({
          title: "Logout realizado",
          description: "Você saiu da sua conta com sucesso.",
          variant: "default",
        });
        navigate('/');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Exceção durante logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: (error as Error).message,
        variant: "destructive",
      });
      setLoading(false);
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
