
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { LoginFormData } from './types';
import { forceCreateProfile } from '../../../services/diagnosticService';

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
  const { login, refreshUserData, currentUser } = useAuth();
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
    setIsSubmitting(true);
    
    // Mostrar feedback visual de carregamento
    const loadingToast = toast.loading('Autenticando...', {
      icon: <Loader2 className="h-5 w-5 animate-spin" />
    });
    
    try {
      console.log('Attempting login with:', formData.email);
      await login(formData.email, formData.password);
      
      // Garantir que os dados do usuário sejam carregados
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Tente garantir que o perfil exista
      if (currentUser) {
        await forceCreateProfile(currentUser);
      }
      
      // Tente atualizar os dados do usuário
      await refreshUserData();
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      // Mostrar feedback visual de sucesso
      toast.success('Login bem-sucedido!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      
      // Verificar se é um e-mail de admin para redirecionar ao painel de admin
      if (isAdminLogin || formData.email.includes('admin') || formData.email === 'lucas@martynlegrand.com') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Fechar o toast de carregamento
      toast.dismiss(loadingToast);
      
      let errorMessage = 'Falha ao fazer login';
      
      if (error.message?.includes('user-not-found') || error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Usuário não encontrado ou senha incorreta';
      } else if (error.message?.includes('wrong-password') || error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Senha incorreta';
      } else if (error.message?.includes('invalid-email')) {
        errorMessage = 'Email inválido';
      } else if (error.message?.includes('too-many-requests')) {
        errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde';
      } else if (error.message?.includes('api-key-not-valid')) {
        errorMessage = 'Erro de configuração do sistema. Entre em contato com o suporte.';
      } else if (error.message?.includes('timeout') || error.message?.includes('network')) {
        errorMessage = 'Tempo limite excedido. Verifique sua conexão e tente novamente.';
      }
      
      // Mostrar feedback visual de erro
      toast.error(errorMessage, {
        duration: 5000,
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
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
