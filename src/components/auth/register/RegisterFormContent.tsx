
import React from 'react';
import { FormField } from './FormField';
import { ProfileTypeSelector } from './ProfileTypeSelector';
import { SubmitButton } from './SubmitButton';
import { RegisterFormData, ProfileType } from './types';

interface RegisterFormContentProps {
  formData: RegisterFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileTypeChange: (value: ProfileType) => void;
  isSubmitting: boolean;
}

export const RegisterFormContent: React.FC<RegisterFormContentProps> = ({
  formData,
  handleChange,
  handleProfileTypeChange,
  isSubmitting
}) => {
  return (
    <form className="space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Display Name"
        name="displayName"
        type="text"
        placeholder="Your Name"
        value={formData.displayName}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Username"
        name="username"
        type="text"
        placeholder="username"
        value={formData.username}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      
      <ProfileTypeSelector
        value={formData.profileType}
        onChange={handleProfileTypeChange}
        disabled={isSubmitting}
      />
      
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};
