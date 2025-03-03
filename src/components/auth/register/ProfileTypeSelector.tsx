
import React from 'react';
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { PROFILE_TYPES, ProfileType } from './constants';

interface ProfileTypeSelectorProps {
  value: ProfileType;
  onChange: (value: ProfileType) => void;
}

export const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">Tipo de Conta</label>
      <RadioGroup 
        value={value} 
        onValueChange={(value: ProfileType) => onChange(value)}
        className="flex space-x-4"
      >
        {PROFILE_TYPES.map((type) => (
          <div key={type.value} className="flex items-center space-x-2">
            <RadioGroupItem value={type.value} id={type.value} className="border-zinc-600" />
            <Label htmlFor={type.value} className="text-zinc-300">{type.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
