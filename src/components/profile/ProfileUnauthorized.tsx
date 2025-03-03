
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ProfileUnauthorizedProps {
  redirectTo?: string;
}

const ProfileUnauthorized: React.FC<ProfileUnauthorizedProps> = ({ redirectTo = '/auth' }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Não autorizado</h2>
        <p className="text-white/70 mb-6">Você precisa estar logado para acessar esta página</p>
        <Button 
          onClick={() => navigate(redirectTo, { state: { from: '/profile' } })}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
        >
          Fazer Login
        </Button>
      </div>
    </div>
  );
};

export default ProfileUnauthorized;
