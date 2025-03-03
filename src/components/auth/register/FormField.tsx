
import React from 'react';
import { Input } from "../../ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = true
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
        className="bg-zinc-900/60 border-zinc-800 text-white"
      />
    </div>
  );
};
