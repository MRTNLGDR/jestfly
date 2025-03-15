import React from 'react';
import { Separator } from "../../ui/separator";

interface SocialLoginOptionsProps {
  isSubmitting: boolean;
}

export const SocialLoginOptions: React.FC<SocialLoginOptionsProps> = ({ isSubmitting }) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-zinc-500">
            Social login options disabled
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {/* Social login buttons removed */}
      </div>
    </div>
  );
};
