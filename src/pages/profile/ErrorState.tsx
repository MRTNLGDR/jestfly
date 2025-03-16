
import React from 'react';
import { Button } from '../../components/ui/button';
import { Undo2, RefreshCw, AlertTriangle } from 'lucide-react';
import ProfileDiagnostic from '../../components/profile/ProfileDiagnostic';

interface ErrorStateProps {
  error: string;
  userId?: string;
  currentUserId?: string;
  onRefresh: () => void;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  userId, 
  currentUserId, 
  onRefresh, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex flex-col items-center justify-center">
      <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Erro</h2>
        <p className="text-white/70 mb-6">{error}</p>
        
        {currentUserId && (
          <>
            <ProfileDiagnostic userId={userId || currentUserId} onRefresh={onRefresh} />
            
            <Button
              onClick={onRefresh}
              className="flex items-center justify-center px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md mr-2 mb-4 w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </>
        )}
        
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center justify-center w-full"
        >
          <Undo2 className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
