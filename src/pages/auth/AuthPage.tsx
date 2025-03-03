
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';

const AuthPage: React.FC = () => {
  const { user, loading } = useAuth();

  // Redirecionar para a home se o usuário já estiver autenticado
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                JESTFLY
              </h1>
              <p className="text-white/70 mt-2">
                Entre para a comunidade futurista da música eletrônica
              </p>
            </div>
            
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
