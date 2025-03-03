
import React from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { CredentialsSection } from './CredentialsSection';
import { ProfileTypeSelector } from './ProfileTypeSelector';
import { AdminCodeField } from './AdminCodeField';
import { SubmitButton } from './SubmitButton';
import { SocialLoginOptions } from './SocialLoginOptions';
import { RegisterFormData } from './types';
import { ProfileType } from './constants';

interface RegisterFormContentProps {
  formData: RegisterFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileTypeChange: (value: ProfileType) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleGoogleRegister: () => Promise<void>;
  isSubmitting: boolean;
  showAdminField: boolean;
}

export const RegisterFormContent: React.FC<RegisterFormContentProps> = ({
  formData,
  handleChange,
  handleProfileTypeChange,
  handleSubmit,
  handleGoogleRegister,
  isSubmitting,
  showAdminField
}) => {
  return (
    <Card className="w-full max-w-md mx-auto glass-morphism">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Criar Conta</CardTitle>
        <CardDescription className="text-center text-zinc-400">
          Junte-se à comunidade JESTFLY hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CredentialsSection 
            formData={formData}
            onChange={handleChange}
          />
          
          <ProfileTypeSelector
            value={formData.profileType}
            onChange={handleProfileTypeChange}
          />
          
          <AdminCodeField
            value={formData.adminCode}
            onChange={handleChange}
            show={showAdminField}
          />
          
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
        
        <SocialLoginOptions
          onGoogleLogin={handleGoogleRegister}
          isSubmitting={isSubmitting}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-zinc-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
