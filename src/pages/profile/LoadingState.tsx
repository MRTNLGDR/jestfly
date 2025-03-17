
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { Button } from '../../components/ui/button';
import { RefreshCw } from 'lucide-react';

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
    if (loadingTime > 10) {
      return "O carregamento está demorando mais que o esperado. Pode haver um problema de conexão...";
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
      </div>
    </div>
  );
};

export default LoadingState;
