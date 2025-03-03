
import React from 'react';
import { Button } from "../../ui/button";
import { ArrowRight, Loader2 } from 'lucide-react';
import { FormInputs } from './FormInputs';
import { LoginFormData } from './types';

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
      
      <SubmitButton 
        isSubmitting={isSubmitting} 
        isAdminLogin={isAdminLogin} 
      />
    </form>
  );
};

// Create a separate component for the submit button
interface SubmitButtonProps {
  isSubmitting: boolean;
  isAdminLogin: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, isAdminLogin }) => {
  const buttonGradientClass = isAdminLogin 
    ? 'bg-gradient-to-r from-red-600/90 to-purple-600/90 hover:from-red-700 hover:to-purple-700' 
    : 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-700 hover:to-blue-700';

  return (
    <Button 
      type="submit" 
      disabled={isSubmitting} 
      className={`w-full group ${buttonGradientClass}`}
    >
      {isSubmitting ? (
        <span className="flex items-center">
          Autenticando <Loader2 className="ml-2 h-4 w-4 animate-spin" />
        </span>
      ) : (
        <span className="flex items-center">
          {isAdminLogin ? 'Admin Login' : 'Entrar'} 
          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </span>
      )}
    </Button>
  );
};
