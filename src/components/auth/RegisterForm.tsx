
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth/useAuth';
import { RegisterFormContent } from './register/RegisterFormContent';
import { RegisterFormData } from './register/types';
import { ProfileType } from './register/constants';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: '',
    profileType: 'fan',
    adminCode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminField, setShowAdminField] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileTypeChange = (value: ProfileType) => {
    setFormData(prev => ({ ...prev, profileType: value }));
    setShowAdminField(value === 'admin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (formData.profileType === 'admin' && !formData.adminCode) {
      toast.error('Código de administrador é obrigatório para contas do tipo Admin');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const loadingToast = toast.loading('Criando conta...');
      
      await register(formData.email, formData.password, {
        displayName: formData.displayName,
        username: formData.username,
        profileType: formData.profileType,
        adminCode: formData.adminCode
      });
      
      toast.dismiss(loadingToast);
      toast.success('Conta criada! Verifique seu email para confirmar o cadastro.');
      
      // Redirecionar para a página de login após o registro bem-sucedido
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error(error.message || 'Falha ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    try {
      const loadingToast = toast.loading('Conectando com Google...');
      await loginWithGoogle();
      toast.dismiss(loadingToast);
      toast.success('Login com Google iniciado!');
      // O usuário será redirecionado automaticamente pelo fluxo OAuth do Supabase
    } catch (error: any) {
      console.error('Google register error:', error);
      let errorMessage = 'Falha ao registrar com Google';
      
      if (error.message && error.message.includes('provider is not enabled')) {
        errorMessage = 'Login com Google não está habilitado. Entre em contato com o administrador.';
      } 
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterFormContent
      formData={formData}
      handleChange={handleChange}
      handleProfileTypeChange={handleProfileTypeChange}
      handleSubmit={handleSubmit}
      handleGoogleRegister={handleGoogleRegister}
      isSubmitting={isSubmitting}
      showAdminField={showAdminField}
    />
  );
};
