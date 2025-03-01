
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Diamond } from 'lucide-react';

const Auth: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // If user is already authenticated, redirect to home
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-8">
        <Diamond className="h-12 w-12 text-purple-500 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">JESTFLY</h1>
        <p className="text-white/60 mt-2">Enter the future of entertainment</p>
      </div>
      
      {/* Background effects */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] -z-10"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[120px] -z-10"></div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-12 h-12 border-t-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default Auth;
