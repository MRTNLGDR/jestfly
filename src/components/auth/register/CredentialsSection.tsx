
import React from 'react';
import { FormField } from './FormField';
import { RegisterFormData } from './types';

interface CredentialsSectionProps {
  formData: RegisterFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = ({ formData, onChange }) => {
  return (
    <>
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="seu@email.com"
        value={formData.email}
        onChange={onChange}
      />
      
      <FormField
        label="Nome de Exibição"
        name="displayName"
        type="text"
        placeholder="Seu Nome"
        value={formData.displayName}
        onChange={onChange}
      />
      
      <FormField
        label="Nome de Usuário"
        name="username" 
        type="text"
        placeholder="usuario"
        value={formData.username}
        onChange={onChange}
      />
      
      <FormField
        label="Senha"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={onChange}
      />
      
      <FormField
        label="Confirmar Senha"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={onChange}
      />
    </>
  );
};
