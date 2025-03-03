
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
      <label className="text-sm font-medium text-zinc-300">Account Type</label>
      <RadioGroup 
        value={value} 
        onValueChange={(value: any) => onChange(value)}
        className="flex space-x-4"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fan" id="fan" className="border-zinc-600" />
          <Label htmlFor="fan" className="text-zinc-300">Fan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="artist" id="artist" className="border-zinc-600" />
          <Label htmlFor="artist" className="text-zinc-300">Artist</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="collaborator" id="collaborator" className="border-zinc-600" />
          <Label htmlFor="collaborator" className="text-zinc-300">Industry Pro</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
