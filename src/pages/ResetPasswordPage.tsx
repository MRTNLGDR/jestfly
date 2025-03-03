
import React from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { GlassCard } from '@/components/ui/glass-card';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="w-full max-w-md mx-auto">
        <GlassCard variant="purple" className="backdrop-blur-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Recuperar Senha
          </h1>
          <ResetPasswordForm />
        </GlassCard>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
