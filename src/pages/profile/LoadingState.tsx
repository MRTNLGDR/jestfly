
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { Button } from '../../components/ui/button';
import { RefreshCw, AlertTriangle, Wrench } from 'lucide-react';

interface LoadingStateProps {
  onRetry?: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ onRetry }) => {
  const [loadingTime, setLoadingTime] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Show different messages based on loading duration
  const getLoadingMessage = () => {
    if (loadingTime > 20) {
      return "Estamos encontrando dificuldades significativas para acessar seu perfil. Recomendamos usar a ferramenta de diagnóstico abaixo.";
    } else if (loadingTime > 15) {
      return "Estamos tendo dificuldades para carregar os dados. Você pode tentar recarregar a página ou usar o diagnóstico...";
    } else if (loadingTime > 10) {
      return "O carregamento está demorando mais que o esperado. Pode haver um problema de conexão ou com seu perfil...";
    } else if (loadingTime > 5) {
      return "Ainda carregando... Pode levar alguns instantes na primeira vez.";
    } else {
      return "Carregando dados do perfil...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex items-center justify-center">
      <div className="text-center neo-blur rounded-xl border border-white/10 p-8 max-w-md w-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-white/70">{getLoadingMessage()}</p>
        
        {loadingTime > 10 && onRetry && (
          <Button 
            onClick={onRetry} 
            className="mt-6 flex items-center justify-center bg-purple-700 hover:bg-purple-800"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        )}
        
        {loadingTime > 15 && (
          <div className="mt-6">
            <div className="p-4 bg-yellow-500/10 rounded-md border border-yellow-500/20 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-yellow-300 font-medium text-sm">
                    Possível problema com seu perfil
                  </p>
                  <p className="text-yellow-200/70 text-xs mt-1">
                    Detectamos um tempo de carregamento anormal. Isto pode indicar problemas com seu perfil ou suas permissões.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={onRetry} 
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 mb-3"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Reparar Perfil Automaticamente
            </Button>
            
            <p className="text-white/50 text-xs mt-2">
              A ferramenta de diagnóstico completa está disponível na página de erro se o problema persistir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
