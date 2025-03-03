
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { SignUpUserData } from '@/types/auth';
import { useProfileFetch } from './useProfileFetch';

export const useSignUp = (setProfile: (profile: any) => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchProfile } = useProfileFetch();

  const signUp = async (email: string, password: string, userData: SignUpUserData) => {
    try {
      setLoading(true);
      console.log('Iniciando registro com email:', email, 'e dados:', userData);
      
      // Validação adicional de campos
      if (!email || !password) {
        toast({
          title: "Campos obrigatórios",
          description: "Email e senha são obrigatórios",
          variant: "destructive",
        });
        setLoading(false);
        return { data: null, error: new Error('Email e senha são obrigatórios') };
      }
      
      if (!userData.display_name || !userData.username) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome de exibição e nome de usuário são obrigatórios",
          variant: "destructive",
        });
        setLoading(false);
        return { data: null, error: new Error('Campos de perfil são obrigatórios') };
      }
      
      if (userData.profile_type === 'admin') {
        toast({
          title: "Tipo de perfil inválido",
          description: "Não é permitido criar contas de administrador",
          variant: "destructive",
        });
        setLoading(false);
        return { data: null, error: new Error('Não é permitido criar contas de administrador') };
      }
      
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
        
        // Melhorar mensagens de erro específicas
        let errorMessage = error.message;
        
        if (error.message.includes('already registered')) {
          errorMessage = 'Este email já está registrado. Tente fazer login ou recuperar sua senha.';
        } else if (error.message.includes('stronger password')) {
          errorMessage = 'Por favor, use uma senha mais forte (mínimo 6 caracteres).';
        }
        
        toast({
          title: "Erro ao criar conta",
          description: errorMessage,
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
            
            // Redirecionar após encontrar perfil
            toast({
              title: "Conta criada com sucesso!",
              description: "Você está agora conectado ao JESTFLY.",
              variant: "default",
            });
            navigate('/');
          } else {
            console.warn('Perfil não encontrado após registro, pode haver um atraso na criação');
            // Tenta novamente após um tempo maior
            setTimeout(async () => {
              const retryProfile = await fetchProfile(data.user!.id);
              if (retryProfile) {
                console.log('Perfil encontrado na segunda tentativa:', retryProfile);
                setProfile(retryProfile);
                toast({
                  title: "Conta criada com sucesso!",
                  description: "Você está agora conectado ao JESTFLY.",
                  variant: "default",
                });
                navigate('/');
              } else {
                toast({
                  title: "Conta criada",
                  description: "Verifique seu e-mail para confirmar o cadastro e faça login novamente.",
                  variant: "default",
                });
              }
            }, 2000);
          }
        }, 1000); // Pequeno atraso para dar tempo ao trigger
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

  return {
    signUp,
    loading
  };
};
