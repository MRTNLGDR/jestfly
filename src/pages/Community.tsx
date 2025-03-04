
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useLanguage } from '../contexts/LanguageContext';
import CommunityHome from '../components/community/CommunityHome';

const Community: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-white">{t('community.title')}</h1>
        <CommunityHome />
      </div>
    </MainLayout>
  );
};

export default Community;
