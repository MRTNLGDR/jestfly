
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
  // Friendlier error messages
  const getFriendlyErrorMessage = (errorMsg: string): string => {
    if (errorMsg.includes('infinite recursion')) {
      return 'Ocorreu um erro de recursão no banco de dados. Estamos trabalhando para resolver este problema.';
    } else if (errorMsg.includes('tempo limite')) {
      return 'O servidor demorou muito para responder. Tente novamente em alguns instantes.';
    } else if (errorMsg.includes('não encontrado')) {
      return 'Não foi possível encontrar os dados do perfil solicitado.';
    } else {
      return errorMsg;
    }
  };

  const friendlyError = getFriendlyErrorMessage(error);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex flex-col items-center justify-center">
      <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Não foi possível carregar o perfil</h2>
        <p className="text-white/70 mb-6">{friendlyError}</p>
        
        {currentUserId && (
          <>
            <div className="bg-yellow-500/10 p-4 rounded-md border border-yellow-500/20 mb-6">
              <p className="text-yellow-300 text-sm">
                Se for a primeira vez que você acessa seu perfil, talvez precise inicializá-lo.
                Use a ferramenta de diagnóstico abaixo para resolver problemas comuns.
              </p>
            </div>
            
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
