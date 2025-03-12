
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-pulse" />
            <div className="relative bg-zinc-900/90 p-4 rounded-full border border-zinc-700">
              <ShieldAlert className="h-16 w-16 text-red-500" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white">Acesso Negado</h1>
        
        <p className="text-zinc-400">
          Você não tem permissão para acessar esta área. Esta seção requer privilégios específicos ou um tipo de conta diferente.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline"
            className="flex items-center justify-center gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            <Home className="h-4 w-4" />
            Ir para Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
