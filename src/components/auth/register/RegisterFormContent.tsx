
import React, { useState, useEffect } from 'react';
import { CredentialsSection } from './CredentialsSection';
import { ProfileTypeSelector } from './ProfileTypeSelector';
import { AdminCodeField } from './AdminCodeField';
import { SocialLoginOptions } from './SocialLoginOptions';
import { SubmitButton } from './SubmitButton';
import { RegisterFormData } from './types';
import { supabaseAuthService } from '../../../contexts/auth/supabaseAuthService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Link } from "react-router-dom";

export interface RegisterFormContentProps {
  formData: RegisterFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileTypeChange: (value: 'fan' | 'artist' | 'collaborator' | 'admin') => void;
  handleSubmit: (e: React.FormEvent) => void;
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
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(false);

  // Verificar se o Google Auth está habilitado
  useEffect(() => {
    const checkGoogleAuth = async () => {
      try {
        const enabled = await supabaseAuthService.isGoogleAuthEnabled();
        setIsGoogleEnabled(enabled);
      } catch (error) {
        console.error("Erro ao verificar status do Google Auth:", error);
        setIsGoogleEnabled(false);
      }
    };
    
    checkGoogleAuth();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto bg-black/30 backdrop-blur-md border border-zinc-800">
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
            handleChange={handleChange}
          />
          
          <ProfileTypeSelector
            selectedType={formData.profileType}
            onChange={handleProfileTypeChange}
          />
          
          <AdminCodeField
            value={formData.adminCode}
            onChange={handleChange}
            show={showAdminField}
          />
          
          <SubmitButton isSubmitting={isSubmitting} />
          
          <SocialLoginOptions
            onGoogleLogin={handleGoogleRegister}
            isSubmitting={isSubmitting}
            isGoogleEnabled={isGoogleEnabled}
          />
        </form>
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
