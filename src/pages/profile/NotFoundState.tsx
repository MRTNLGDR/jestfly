
import React from 'react';
import { Button } from '../../components/ui/button';
import { Undo2 } from 'lucide-react';
import ProfileDiagnostic from '../../components/profile/ProfileDiagnostic';

interface NotFoundStateProps {
  userId?: string;
  currentUserId?: string;
  onRefresh: () => void;
  onBack: () => void;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ 
  userId, 
  currentUserId, 
  onRefresh, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex flex-col items-center justify-center">
      <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-3">Perfil não encontrado</h2>
        <p className="text-white/70 mb-6">
          O perfil que você está procurando não existe ou foi removido.
        </p>
        
        {currentUserId && (
          <ProfileDiagnostic userId={userId || currentUserId} onRefresh={onRefresh} />
        )}
        
        <Button
          onClick={onBack}
          className="flex items-center justify-center w-full"
          variant="outline"
        >
          <Undo2 className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;
