
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  className = ''
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white">{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        value={value}
        onChange={onChange}
        className={`bg-black/30 border-white/20 text-white ${className}`}
      />
    </div>
  );
};

export default FormField;
