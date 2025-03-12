
import React from 'react';
import { Input } from "../../ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  required = true,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="bg-zinc-900/60 border-zinc-800 text-white"
      />
    </div>
  );
};
