
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { RegisterFormContent } from './register';
import { RegisterFormData } from './register/types';
import { useAuth } from '../../contexts/auth/useAuth';

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

  const handleProfileTypeChange = (value: 'fan' | 'artist' | 'collaborator' | 'admin') => {
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
    
    setIsSubmitting(true);
    
    try {
      await register(formData.email, formData.password, {
        displayName: formData.displayName,
        username: formData.username,
        profileType: formData.profileType,
        adminCode: formData.adminCode
      });
      
      toast.success('Conta criada com sucesso!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success('Conta criada com sucesso!');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao registrar com Google');
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
