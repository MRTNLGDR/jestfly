
import React from 'react';
import { Input } from "../../ui/input";
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  required?: boolean;
  icon: LucideIcon;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
  required = true,
  icon: Icon
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Icon className="w-4 h-4 mr-2 text-purple-500" />
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      </div>
      <div className="relative">
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="bg-zinc-900/60 border-zinc-800 text-white pl-3 focus-visible:ring-purple-500/50"
        />
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500/80 to-blue-500/80 rounded-l-md"></div>
      </div>
    </div>
  );
};
