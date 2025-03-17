
import React from 'react';
import { Button } from '../../components/ui/button';
import { Undo2, RefreshCw, AlertTriangle, LifeBuoy, Wrench } from 'lucide-react';
import ProfileDiagnostic from '../../components/profile/ProfileDiagnostic';
import { toast } from 'sonner';

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
      return 'Identificamos um problema técnico nas permissões do seu perfil. Use a ferramenta de diagnóstico abaixo para resolver automaticamente.';
    } else if (errorMsg.includes('tempo limite') || errorMsg.includes('Timeout')) {
      return 'O servidor demorou muito para responder. Este problema pode ser temporário ou relacionado à sua conexão. Tente novamente em alguns instantes.';
    } else if (errorMsg.includes('não encontrado') || errorMsg.includes('not found')) {
      return 'Não foi possível encontrar seu perfil. Se você acabou de criar sua conta, use a ferramenta de diagnóstico abaixo para configurar seu perfil.';
    } else if (errorMsg.includes('buscar dados do usuário')) {
      return 'Não foi possível carregar seus dados de perfil. Use a ferramenta de diagnóstico para resolver este problema automaticamente.';
    } else {
      return errorMsg;
    }
  };

  const friendlyError = getFriendlyErrorMessage(error);
  const isProfileOwner = currentUserId && (userId === currentUserId || !userId);
  
  const handleContactSupport = () => {
    toast.info("Funcionalidade de suporte será disponibilizada em breve!");
    // Aqui poderíamos implementar um formulário de contato ou abrir um sistema de tickets
  };

  const handleForceRepair = () => {
    toast.info("Iniciando reparação automática do perfil...");
    // Em vez de apenas exibir um toast, faça algo útil
    onRefresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex flex-col items-center justify-center">
      <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Não foi possível carregar o perfil</h2>
        <p className="text-white/70 mb-6">{friendlyError}</p>
        
        {isProfileOwner ? (
          <>
            <div className="bg-yellow-500/10 p-4 rounded-md border border-yellow-500/20 mb-6">
              <p className="text-yellow-300 text-sm">
                {userId ? 
                  "Use a ferramenta de diagnóstico abaixo para resolver problemas com seu perfil automaticamente." :
                  "Se for a primeira vez que você acessa seu perfil, talvez precise inicializá-lo. Use a ferramenta de diagnóstico abaixo para configurar seu perfil."
                }
              </p>
            </div>
            
            <Button 
              onClick={handleForceRepair}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full mb-4"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Reparar Perfil Automaticamente
            </Button>
            
            <ProfileDiagnostic userId={userId || currentUserId} onRefresh={onRefresh} />
            
            <Button
              onClick={onRefresh}
              className="flex items-center justify-center px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md mr-2 mb-4 w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </>
        ) : (
          <div className="bg-blue-500/10 p-4 rounded-md border border-blue-500/20 mb-6">
            <p className="text-blue-300 text-sm">
              Este perfil pode não existir ou você não tem permissão para visualizá-lo.
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center justify-center w-full"
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          {!isProfileOwner && (
            <Button 
              onClick={handleContactSupport}
              variant="ghost" 
              className="flex items-center justify-center w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              Contactar Suporte
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
