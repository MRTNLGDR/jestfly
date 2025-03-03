
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth';
import { toast } from 'sonner';

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
