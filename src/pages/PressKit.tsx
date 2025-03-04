
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { GlassCard } from '../components/ui/glass-card';

const PressKit: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-white">{t('nav.presskit')}</h1>
        <GlassCard className="p-8">
          <p className="text-white/80">O kit de imprensa está em desenvolvimento.</p>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default PressKit;
