
import React from 'react';
import { FormField } from './FormField';
import { Mail, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoginFormData } from './types';

interface FormInputsProps {
  formData: LoginFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInputs: React.FC<FormInputsProps> = ({
  formData,
  handleChange
}) => {
  return (
    <>
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
    </>
  );
};
