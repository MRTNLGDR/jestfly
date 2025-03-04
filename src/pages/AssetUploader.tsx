
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';

const AssetUploader: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Gerenciador de Assets</h1>
        
        <GlassCard className="p-6">
          <p className="text-white">O componente de upload de assets será implementado aqui.</p>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default AssetUploader;
