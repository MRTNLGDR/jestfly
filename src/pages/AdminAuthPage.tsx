
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { GlassCard } from '@/components/ui/glass-card';

const AdminAuthPage: React.FC = () => {
  const { user, profile } = useAuth();

  // Se o usuário já estiver autenticado e for admin, redirecionar para o painel admin
  if (user && profile && profile.profile_type === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  // Se o usuário já estiver autenticado mas NÃO for admin, redirecionar para a página inicial
  if (user && profile && profile.profile_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-black to-blue-950">
      <div className="w-full max-w-md">
        <GlassCard variant="blue" className="backdrop-blur-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            JESTFLY Admin
          </h1>
          <AdminLoginForm />
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminAuthPage;
