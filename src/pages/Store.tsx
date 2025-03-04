
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { GlassCard } from '../components/ui/glass-card';

const Store: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-white">{t('store.title')}</h1>
        <GlassCard className="p-8">
          <p className="text-white/80">O sistema completo de loja está em desenvolvimento.</p>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default Store;
