
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth';
import { toast } from 'sonner';
import { isGoogleAuthEnabled } from '../../../contexts/auth/supabase';

export const useGoogleAuth = () => {
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    // Verifique se o login do Google está habilitado
    const checkGoogleAuth = async () => {
      try {
        const enabled = await isGoogleAuthEnabled();
        setIsGoogleEnabled(enabled);
      } catch (error) {
        console.error("Erro ao verificar o status do Google Auth:", error);
        setIsGoogleEnabled(false);
      }
    };

    checkGoogleAuth();
  }, []);

  const handleGoogleLogin = async () => {
    if (!isGoogleEnabled) {
      toast.error("Autenticação do Google não está configurada");
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      // O redirecionamento acontecerá automaticamente via mudança de estado de autenticação
    } catch (error: any) {
      toast.error(error.message || "Falha ao fazer login com o Google");
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

const GoogleLoginHandler: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        // Google auth is enabled
        const isGoogleAuthEnabled = true;
        
        if (!isGoogleAuthEnabled) {
          toast.error("Google authentication is not configured");
          navigate('/login');
          return;
        }

        await loginWithGoogle();
        // Redirect will happen automatically via auth state change
      } catch (error: any) {
        toast.error(error.message || "Failed to login with Google");
        navigate('/login');
      }
    };

    handleGoogleLogin();
  }, [loginWithGoogle, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default GoogleLoginHandler;
