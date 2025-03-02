
import React from 'react';
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { Shield } from 'lucide-react';
import { ProfileTypeOption } from './types';

interface ProfileTypeSelectorProps {
  selectedType: 'fan' | 'artist' | 'collaborator' | 'admin';
  onChange: (value: 'fan' | 'artist' | 'collaborator' | 'admin') => void;
}

export const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = ({ 
  selectedType, 
  onChange 
}) => {
  const profileTypes: ProfileTypeOption[] = [
    { value: 'fan', label: 'Fã' },
    { value: 'artist', label: 'Artista' },
    { value: 'collaborator', label: 'Profissional' },
    { value: 'admin', label: 'Admin' }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center mb-2">
        <Shield className="w-4 h-4 mr-2 text-purple-500" />
        <label className="text-sm font-medium text-zinc-300">Tipo de Conta</label>
      </div>
      <RadioGroup 
        value={selectedType} 
        onValueChange={(value: any) => onChange(value)}
        className="grid grid-cols-2 gap-2"
      >
        {profileTypes.map((type) => (
          <div key={type.value} className="flex items-center space-x-2 bg-zinc-900/40 border border-zinc-800 p-2 rounded-md">
            <RadioGroupItem value={type.value} id={type.value} className="border-zinc-600" />
            <Label htmlFor={type.value} className="text-zinc-300">{type.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
