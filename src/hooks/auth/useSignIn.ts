
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useProfileFetch } from './useProfileFetch';

export const useSignIn = (setProfile: (profile: any) => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchProfile } = useProfileFetch();

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Iniciando login com email: ${email}`);
      setLoading(true);
      
      // Garantir que o email e senha não estejam vazios
      if (!email || !password) {
        console.error('Email ou senha vazios');
        toast({
          title: "Campos obrigatórios",
          description: "Email e senha são obrigatórios",
          variant: "destructive",
        });
        setLoading(false);
        return { data: null, error: new Error('Email e senha são obrigatórios') };
      }
      
      // Tenta fazer login com o Supabase
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Erro de autenticação:', error.message);
        
        // Mensagem de erro específica
        let errorMessage = 'Erro ao fazer login';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada';
        }
        
        toast({
          title: "Erro ao fazer login",
          description: errorMessage,
          variant: "destructive",
        });
        
        setLoading(false);
        return { data: null, error };
      }
      
      if (data && data.user) {
        console.log('Login bem-sucedido, ID do usuário:', data.user.id);
        
        // Buscar perfil após login
        const profileData = await fetchProfile(data.user.id);
        if (profileData) {
          console.log('Perfil recuperado após login, tipo:', profileData.profile_type);
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
          // Ainda redireciona para página inicial mesmo sem perfil
          navigate('/');
        }
      } else {
        console.error('Login bem-sucedido mas não retornou dados do usuário');
        toast({
          title: "Erro no sistema",
          description: "Ocorreu um erro no sistema durante o login.",
          variant: "destructive",
        });
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

  return {
    signIn,
    loading
  };
};
