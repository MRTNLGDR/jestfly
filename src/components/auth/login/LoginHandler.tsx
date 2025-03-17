
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth';
import { toast } from 'sonner';
import { LoginFormData } from '../../../types/auth';
import { attemptProfileFix } from '../../../services/diagnostic/profileRepair';

interface LoginHandlerProps {
  children: (props: {
    formData: LoginFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    isAdminLogin: boolean;
    toggleAdminLogin: () => void;
  }) => React.ReactNode;
}

export const LoginHandler: React.FC<LoginHandlerProps> = ({ children }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsSubmitting(true);
    
    // Mostrar toast de carregamento
    const loadingToastId = toast.loading('Entrando...');
    
    try {
      console.log('Tentando login com:', formData.email);
      await login(formData.email, formData.password);
      
      // Esperar um momento para garantir que a sessão foi estabelecida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar e corrigir possíveis problemas de perfil
      try {
        const fixResult = await attemptProfileFix();
        if (!fixResult.success) {
          console.warn("Alerta: Problemas detectados com o perfil:", fixResult.message);
          // Continuar mesmo com problemas, mas registrar
        }
      } catch (fixErr) {
        console.error("Erro ao tentar corrigir perfil:", fixErr);
        // Continuar mesmo com erro
      }
      
      // Atualizar dados do usuário
      await refreshUserData();
      
      // Fechar o toast de carregamento e mostrar sucesso
      toast.dismiss(loadingToastId);
      toast.success('Login realizado com sucesso!');
      
      // Redirecionar com base no tipo de usuário
      if (isAdminLogin || formData.email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Erro de login:', error);
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToastId);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Falha ao fazer login';
      
      if (error.message?.includes('user-not-found') || error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message?.includes('wrong-password')) {
        errorMessage = 'Senha incorreta';
      } else if (error.message?.includes('invalid-email')) {
        errorMessage = 'Email inválido';
      } else if (error.message?.includes('too-many-requests')) {
        errorMessage = 'Tente novamente mais tarde';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Problema de conexão. Verifique sua internet.';
      } else if (error.message?.includes('infinite recursion')) {
        errorMessage = 'Erro de configuração no servidor. Por favor, contate o suporte.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {children({
        formData,
        handleChange,
        handleSubmit,
        isSubmitting,
        isAdminLogin,
        toggleAdminLogin
      })}
    </>
  );
};
