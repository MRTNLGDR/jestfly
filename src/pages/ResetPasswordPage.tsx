
import React from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
