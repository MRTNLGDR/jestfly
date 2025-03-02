
import React from 'react';
import { Button } from "../../ui/button";
import { Mail, User, Lock, AtSign } from 'lucide-react';
import { FormField } from './FormField';
import { ProfileTypeSelector } from './ProfileTypeSelector';
import { AdminCodeField } from './AdminCodeField';
import { SocialLoginOptions } from './SocialLoginOptions';
import { RegisterFormData } from './types';

interface RegisterFormContentProps {
  formData: RegisterFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileTypeChange: (value: 'fan' | 'artist' | 'collaborator' | 'admin') => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleGoogleRegister: () => void;
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="seu@email.com"
        label="Email"
        icon={Mail}
      />
      
      <FormField
        name="displayName"
        type="text"
        value={formData.displayName}
        onChange={handleChange}
        placeholder="Seu Nome"
        label="Nome de Exibição"
        icon={User}
      />
      
      <FormField
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        placeholder="usuario"
        label="Nome de Usuário"
        icon={AtSign}
      />
      
      <FormField
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        label="Senha"
        icon={Lock}
      />
      
      <FormField
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        label="Confirmar Senha"
        icon={Lock}
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
      
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 group"
      >
        {isSubmitting ? 'Criando Conta...' : 'Cadastrar'}
      </Button>
      
      <SocialLoginOptions
        onGoogleLogin={handleGoogleRegister}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};
