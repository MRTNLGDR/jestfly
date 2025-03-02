
import React from 'react';
import { Shield } from 'lucide-react';
import { FormField } from './FormField';

interface AdminCodeFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
}

export const AdminCodeField: React.FC<AdminCodeFieldProps> = ({ value, onChange, show }) => {
  if (!show) return null;
  
  return (
    <FormField
      name="adminCode"
      type="password"
      value={value}
      onChange={onChange}
      placeholder="Insira o código de administrador"
      label="Código de Administrador"
      icon={Shield}
    />
  );
};
