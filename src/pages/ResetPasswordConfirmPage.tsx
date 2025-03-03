
import React from 'react';
import ResetPasswordConfirmForm from '@/components/auth/ResetPasswordConfirmForm';

const ResetPasswordConfirmPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-black to-purple-950">
      <div className="w-full max-w-md">
        <ResetPasswordConfirmForm />
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
