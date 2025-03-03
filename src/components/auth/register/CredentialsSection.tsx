
import React from 'react';
import { FormField } from './FormField';
import { Mail, User, AtSign, Lock } from 'lucide-react';
import { 
  EmailHeader, 
  DisplayNameHeader, 
  UsernameHeader, 
  PasswordHeader, 
  ConfirmPasswordHeader 
} from './FormHeader';
import { RegisterFormData } from './types';

interface CredentialsSectionProps {
  formData: RegisterFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = ({
  formData,
  handleChange
}) => {
  return (
    <>
      <FormField
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="seu@email.com"
        label="Email"
        icon={Mail}
        headerComponent={<EmailHeader />}
      />
      
      <FormField
        name="displayName"
        type="text"
        value={formData.displayName}
        onChange={handleChange}
        placeholder="Seu Nome"
        label="Nome de Exibição"
        icon={User}
        headerComponent={<DisplayNameHeader />}
      />
      
      <FormField
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        placeholder="usuario"
        label="Nome de Usuário"
        icon={AtSign}
        headerComponent={<UsernameHeader />}
      />
      
      <FormField
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        label="Senha"
        icon={Lock}
        headerComponent={<PasswordHeader />}
      />
      
      <FormField
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        label="Confirmar Senha"
        icon={Lock}
        headerComponent={<ConfirmPasswordHeader />}
      />
    </>
  );
};
