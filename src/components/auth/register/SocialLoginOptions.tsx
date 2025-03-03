
import React from 'react';
import { Button } from "../../ui/button";
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

interface SocialLoginOptionsProps {
  onGoogleLogin: () => Promise<void>;
  isSubmitting: boolean;
  isGoogleEnabled?: boolean;
}

export const SocialLoginOptions: React.FC<SocialLoginOptionsProps> = ({
  onGoogleLogin,
  isSubmitting,
  isGoogleEnabled = false // Por padrão, assumimos que não está habilitado
}) => {
  
  const handleGoogleClick = async () => {
    if (!isGoogleEnabled) {
      toast.error('Registro com Google não está configurado. Entre em contato com o administrador.');
      return Promise.reject(new Error('Google auth not enabled'));
    }
    
    return onGoogleLogin();
  };

  if (!isGoogleEnabled) {
    return null; // Não mostra a opção se não estiver habilitado
  }

  return (
    <div className="mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black/30 px-2 text-zinc-400">Ou continue com</span>
        </div>
      </div>
      
      <Button 
        onClick={handleGoogleClick} 
        disabled={isSubmitting}
        variant="outline" 
        className="w-full mt-4 text-white bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80"
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Google
      </Button>
    </div>
  );
};
