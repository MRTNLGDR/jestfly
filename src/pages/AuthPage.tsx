
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { GlassCard } from '@/components/ui/glass-card';

const AuthPage: React.FC = () => {
  const { user, profile } = useAuth();

  if (user && profile && profile.profile_type === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user && profile && profile.profile_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-black to-purple-950">
      <div className="w-full max-w-md">
        <GlassCard variant="purple" className="backdrop-blur-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            JESTFLY
          </h1>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 text-white mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-purple-700">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-purple-700">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </GlassCard>
      </div>
    </div>
  );
};

export default AuthPage;
