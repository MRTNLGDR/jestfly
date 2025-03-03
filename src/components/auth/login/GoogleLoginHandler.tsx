
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/auth';

// Custom hook for Google authentication
export const useGoogleAuth = () => {
  const { loginWithGoogle, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // We'll assume Google authentication is always enabled for now
  // In a real application, this might be determined by configuration or API calls
  const isGoogleEnabled = true;
  
  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
    } catch (err) {
      console.error('Google login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    handleGoogleLogin,
    error,
    isGoogleEnabled,
    isSubmitting
  };
};

const GoogleLoginHandler: React.FC = () => {
  const { handleGoogleLogin } = useGoogleAuth();
  
  return (
    <button 
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 hover:bg-gray-50 transition-colors"
    >
      <img 
        src="/assets/google-calendar.svg" 
        alt="Google" 
        className="w-5 h-5" 
      />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLoginHandler;
