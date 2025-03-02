
import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { ProtectedRoute } from '../components/ProtectedRoute';

const LoginPage: React.FC = () => {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center bg-black">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 via-black to-black -z-10"></div>
        
        {/* Purple glow effect */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[120px] -z-10"></div>
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Sign in to JESTFLY
          </h2>
        </div>
        <LoginForm />
      </div>
    </ProtectedRoute>
  );
};

export default LoginPage;
