
import React from 'react';
import { Input } from "../../ui/input";

interface AdminCodeFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
}

export const AdminCodeField: React.FC<AdminCodeFieldProps> = ({ value, onChange, show }) => {
  if (!show) return null;
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">Código de Admin</label>
      <Input
        type="text"
        name="adminCode"
        placeholder="Código de administrador"
        value={value}
        onChange={onChange}
        required
        className="bg-zinc-900/60 border-zinc-800 text-white"
      />
      <p className="text-xs text-zinc-500 italic">
        Para contas de administrador, é necessário um código de autorização.
      </p>
    </div>
  );
};
