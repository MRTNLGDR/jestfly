
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { LoginForm } from '../components/auth/LoginForm';
import { GlassCard } from '../components/ui/glass-card';

const Login: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
        <GlassCard className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">{t('auth.login')}</h1>
          <LoginForm />
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default Login;
