
import React from 'react';
import { Button } from "../../ui/button";
import { ArrowRight } from 'lucide-react';
import { FormInputs } from './FormInputs';
import { LoginFormData } from '../../../types/auth';
import { LoadingSpinner } from '../../ui/loading-spinner';

interface LoginFormProps {
  formData: LoginFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isAdminLogin: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  isAdminLogin
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInputs 
        formData={formData} 
        handleChange={handleChange} 
      />
      
      <LoginButton 
        isSubmitting={isSubmitting} 
        isAdminLogin={isAdminLogin} 
      />
    </form>
  );
};

// Componente separado para o botão de login com estado de carregamento
const LoginButton: React.FC<{
  isSubmitting: boolean;
  isAdminLogin: boolean;
}> = ({ isSubmitting, isAdminLogin }) => {
  const buttonGradientClass = isAdminLogin 
    ? 'bg-gradient-to-r from-red-600/90 to-purple-600/90 hover:from-red-700 hover:to-purple-700' 
    : 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-700 hover:to-blue-700';

  return (
    <Button 
      type="submit" 
      disabled={isSubmitting} 
      className={`w-full group ${buttonGradientClass} transition-all duration-300`}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          Entrando...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          {isAdminLogin ? 'Admin Login' : 'Entrar'} 
          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </span>
      )}
    </Button>
  );
};
