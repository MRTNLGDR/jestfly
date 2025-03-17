
import React from 'react';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-white/70">Carregando dados do perfil...</p>
        <p className="mt-2 text-sm text-white/50">Isso pode levar alguns instantes...</p>
      </div>
    </div>
  );
};

export default LoadingState;
