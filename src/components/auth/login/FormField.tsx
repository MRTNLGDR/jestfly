
import React from 'react';
import { Input } from "../../ui/input";
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormFieldProps {
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  icon: LucideIcon;
  rightElement?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  rightElement
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="w-4 h-4 mr-2 text-purple-400/80" />
          <label className="text-sm font-medium text-zinc-300">{label}</label>
        </div>
        {rightElement}
      </div>
      <div className="relative">
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50 text-white pl-3 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/50"
        />
      </div>
    </div>
  );
};
