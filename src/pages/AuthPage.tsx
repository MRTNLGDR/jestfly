
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const { user, profile } = useAuth();

  if (user && profile && profile.profile_type === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user && profile && profile.profile_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 text-white">
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
      </div>
    </div>
  );
};

export default AuthPage;
