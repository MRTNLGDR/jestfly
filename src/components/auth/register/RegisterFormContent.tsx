
import React, { useState, useEffect } from 'react';
import { CredentialsSection } from './CredentialsSection';
import { ProfileTypeSelector } from './ProfileTypeSelector';
import { AdminCodeField } from './AdminCodeField';
import { SocialLoginOptions } from './SocialLoginOptions';
import { SubmitButton } from './SubmitButton';
import { RegisterFormData } from './types';
import { supabaseAuthService } from '../../../contexts/auth/supabaseAuthService';

interface RegisterFormContentProps {
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
  );
};
