
import React from 'react';
import { Button } from "../../ui/button";
import { FcGoogle } from 'react-icons/fc';

interface SocialLoginOptionsProps {
  onGoogleLogin: () => void;
  isSubmitting: boolean;
}

export const SocialLoginOptions: React.FC<SocialLoginOptionsProps> = ({ 
  onGoogleLogin, 
  isSubmitting 
}) => {
  return (
    <>
      <div className="mt-4 relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black/40 px-2 text-zinc-400">Ou continue com</span>
        </div>
      </div>
      
      <Button 
        onClick={onGoogleLogin} 
        disabled={isSubmitting}
        variant="outline" 
        className="w-full mt-4 text-white bg-zinc-900/50 border-zinc-700/50 hover:bg-zinc-800/60"
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Google
      </Button>
    </>
  );
};
