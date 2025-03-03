
import React from 'react';
import { Button } from "../../ui/button";
import { Mail, LockKeyhole, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FormField } from './FormField';
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
      <FormField
        name="email"
        type="email"
        placeholder="seu@email.com"
        value={formData.email}
        onChange={handleChange}
        label="Email"
        icon={Mail}
      />
      
      <FormField
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        label="Senha"
        icon={LockKeyhole}
        rightElement={
          <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 hover:underline">
            Esqueceu a senha?
          </Link>
        }
      />
      
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className={`w-full group ${isAdminLogin 
          ? 'bg-gradient-to-r from-red-600/90 to-purple-600/90 hover:from-red-700 hover:to-purple-700' 
          : 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-700 hover:to-blue-700'}`}
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
    </form>
  );
};
