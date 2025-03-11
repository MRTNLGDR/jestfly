
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';

const AuthPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/';
  
  useEffect(() => {
    // Se o usuário já estiver autenticado, redireciona para a página de origem
    if (user && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, from]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20">
      <GlassHeader />
      
      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="w-full max-w-md">
            <AuthForm redirectPath={from} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
