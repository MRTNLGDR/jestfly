
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useLanguage } from '../contexts/LanguageContext';
import RegisterForm from '../components/auth/RegisterForm';
import { GlassCard } from '../components/ui/glass-card';

const Register: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
        <GlassCard className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">{t('auth.register')}</h1>
          <RegisterForm />
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default Register;
