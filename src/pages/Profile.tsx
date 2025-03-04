
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { GlassCard } from '../components/ui/glass-card';
import ProfileForm from '../components/profile/ProfileForm';
import Loading from '../components/ui/loading';

const Profile: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
          <Loading fullScreen={true} />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h2>
            <p className="text-white/70">Você precisa estar logado para acessar seu perfil.</p>
          </GlassCard>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-white">{t('profile.title')}</h1>
        <GlassCard className="p-8">
          <ProfileForm />
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default Profile;
