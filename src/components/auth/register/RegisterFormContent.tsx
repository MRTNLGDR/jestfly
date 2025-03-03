
import React from 'react';
import { FormField } from './FormField';
import { ProfileTypeSelector } from './ProfileTypeSelector';
import { SubmitButton } from './SubmitButton';
import { RegisterFormData, ProfileType } from './types';

interface RegisterFormContentProps {
  formData: RegisterFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileTypeChange: (value: ProfileType) => void;
  isSubmitting: boolean;
}

export const RegisterFormContent: React.FC<RegisterFormContentProps> = ({
  formData,
  handleChange,
  handleProfileTypeChange,
  isSubmitting
}) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="seu@email.com"
        value={formData.email}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Nome de Exibição"
        name="displayName"
        type="text"
        placeholder="Seu Nome"
        value={formData.displayName}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Nome de Usuário"
        name="username"
        type="text"
        placeholder="nome_de_usuario"
        value={formData.username}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Senha"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Confirmar Senha"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <ProfileTypeSelector
        value={formData.profileType}
        onChange={handleProfileTypeChange}
        disabled={isSubmitting}
      />
      
      <SubmitButton isSubmitting={isSubmitting} />
    </div>
  );
};
