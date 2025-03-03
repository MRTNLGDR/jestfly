
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const useGoogleAuth = () => {
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(true); // Directly set to true instead of checking
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (!isGoogleEnabled) {
      toast.error('Login com Google não está configurado. Entre em contato com o administrador.');
      return Promise.reject(new Error('Google auth not enabled'));
    }
    
    setIsSubmitting(true);
    
    const loadingToast = toast.loading('Conectando com Google...', {
      icon: <Loader2 className="h-5 w-5 animate-spin" />
    });
    
    try {
      await loginWithGoogle();
      
      toast.dismiss(loadingToast);
      
      toast.success('Login bem-sucedido!', {
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
      
      navigate('/profile');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Google login error:', error);
      
      toast.dismiss(loadingToast);
      
      let errorMessage = 'Falha ao fazer login com Google';
      
      if (error.message?.includes('provider is not enabled')) {
        errorMessage = 'Login com Google não está habilitado. Entre em contato com o administrador.';
      } else if (error.message?.includes('api-key-not-valid')) {
        errorMessage = 'Erro de configuração. Entre em contato com o suporte.';
      }
      
      toast.error(errorMessage, {
        duration: 5000,
        icon: <XCircle className="h-5 w-5 text-red-500" />
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isGoogleEnabled,
    isSubmitting,
    handleGoogleLogin
  };
};
