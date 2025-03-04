
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { GlassCard } from '../components/ui/glass-card';

const CreativeFlow: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-white">{t('nav.notes')}</h1>
        <GlassCard className="p-8">
          <p className="text-white/80">O CreativeFlow Board está em desenvolvimento.</p>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default CreativeFlow;
