
import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ProtectedRoute } from '../components/ProtectedRoute';

const RegisterPage: React.FC = () => {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black bg-opacity-90"></div>
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: `linear-gradient(#9b59b6 1px, transparent 1px), linear-gradient(90deg, #9b59b6 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>
        
        {/* Gradient light effects */}
        <div className="absolute top-0 left-0 right-0 bottom-0 -z-5">
          <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-3xl font-bold text-center text-white mb-6 flex flex-col items-center">
              <span className="text-3xl bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">JESTFLY</span>
              <div className="w-40 h-1 bg-gradient-to-r from-purple-600 to-blue-500 mt-3 rounded-full"></div>
            </h2>
          </div>
          <RegisterForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RegisterPage;
