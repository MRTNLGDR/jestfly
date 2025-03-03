
import React from 'react';
import { Mail, User, Lock, AtSign, Shield } from 'lucide-react';

// Component to render form section headers with icons
interface FormHeaderProps {
  icon: React.ReactNode;
  label: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center mb-2">
      {icon}
      <label className="text-sm font-medium text-zinc-300">{label}</label>
    </div>
  );
};

// Predefined headers with specific icons
export const EmailHeader = () => (
  <FormHeader icon={<Mail className="w-4 h-4 mr-2 text-purple-500" />} label="Email" />
);

export const DisplayNameHeader = () => (
  <FormHeader icon={<User className="w-4 h-4 mr-2 text-purple-500" />} label="Nome de Exibição" />
);

export const UsernameHeader = () => (
  <FormHeader icon={<AtSign className="w-4 h-4 mr-2 text-purple-500" />} label="Nome de Usuário" />
);

export const PasswordHeader = () => (
  <FormHeader icon={<Lock className="w-4 h-4 mr-2 text-purple-500" />} label="Senha" />
);

export const ConfirmPasswordHeader = () => (
  <FormHeader icon={<Lock className="w-4 h-4 mr-2 text-purple-500" />} label="Confirmar Senha" />
);

export const AccountTypeHeader = () => (
  <FormHeader icon={<Shield className="w-4 h-4 mr-2 text-purple-500" />} label="Tipo de Conta" />
);
