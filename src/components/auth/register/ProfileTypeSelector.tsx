
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
  // Esta função garante que os valores são convertidos corretamente para o tipo esperado pelo banco
  const handleProfileTypeChange = (selected: string) => {
    // Converte o valor string para o tipo ProfileType
    const profileType = selected as ProfileType;
    onChange(profileType);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">Tipo de Conta</label>
      <RadioGroup 
        value={value} 
        onValueChange={handleProfileTypeChange}
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
        <div className="flex items-center space-x-2 bg-purple-900/30 p-2 rounded-md border border-purple-500/50">
          <RadioGroupItem value="admin" id="admin" className="border-purple-400" />
          <Label htmlFor="admin" className="text-purple-300 font-medium">Administrador</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
