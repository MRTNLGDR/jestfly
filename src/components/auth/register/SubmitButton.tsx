
import React from 'react';
import { Button } from "../../ui/button";
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <Button 
      type="submit" 
      disabled={isSubmitting} 
      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
    >
      {isSubmitting ? (
        <span className="flex items-center">
          Criando Conta <Loader2 className="ml-2 h-4 w-4 animate-spin" />
        </span>
      ) : 'Cadastrar'}
    </Button>
  );
};
