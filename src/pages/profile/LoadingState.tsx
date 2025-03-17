
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

const LoadingState: React.FC = () => {
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
      return "Estamos tendo dificuldades para carregar os dados. Aguarde mais um pouco...";
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
        {loadingTime > 15 && (
          <div className="mt-4 p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
            <p className="text-blue-300 text-sm">
              Se o carregamento persistir, tente atualizar a página ou voltar mais tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
