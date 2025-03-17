
import React from 'react';
import { Button } from '../../components/ui/button';
import { Undo2, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRefresh: () => void;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRefresh, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex flex-col items-center justify-center">
      <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Não foi possível carregar o perfil</h2>
        <p className="text-white/70 mb-6">{error}</p>
        
        <div className="flex flex-col space-y-3">
          <Button
            onClick={onRefresh}
            className="flex items-center justify-center px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
          
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
    </div>
  );
};

export default ErrorState;
