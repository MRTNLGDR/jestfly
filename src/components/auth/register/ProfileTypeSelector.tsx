
import React from 'react';
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { ProfileType } from './types';

interface ProfileTypeSelectorProps {
  value: ProfileType;
  onChange: (value: ProfileType) => void;
  disabled?: boolean;
}

export const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">Tipo de Conta</label>
      <RadioGroup 
        value={value} 
        onValueChange={(value: any) => onChange(value)}
        className="flex flex-wrap gap-4"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fan" id="fan" className="border-zinc-600" />
          <Label htmlFor="fan" className="text-zinc-300">Fã</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="artist" id="artist" className="border-zinc-600" />
          <Label htmlFor="artist" className="text-zinc-300">Artista</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="collaborator" id="collaborator" className="border-zinc-600" />
          <Label htmlFor="collaborator" className="text-zinc-300">Colaborador</Label>
        </div>
        {/* Admin option could be hidden by default and only shown with a special code */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="admin" id="admin" className="border-zinc-600" />
          <Label htmlFor="admin" className="text-zinc-300">Administrador</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
