
import React, { useState } from 'react';
import { FormField } from './FormField';
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        label="Senha"
        icon={LockKeyhole}
        rightElement={
          <div className="flex space-x-3 items-center">
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 hover:underline transition-colors">
              Esqueceu?
            </Link>
          </div>
        }
      />
    </>
  );
};
