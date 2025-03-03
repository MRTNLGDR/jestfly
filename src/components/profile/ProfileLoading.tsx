
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProfileLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="text-white/70">Carregando seu perfil...</p>
      </div>
    </div>
  );
};

export default ProfileLoading;
