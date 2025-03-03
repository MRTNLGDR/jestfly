
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/auth';

const UnauthorizedPage: React.FC = () => {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 via-black to-black -z-10"></div>
      
      {/* Purple glow effect */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[120px] -z-10"></div>
      
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Acesso Negado
          </h1>
          <div className="mt-2 h-1 w-32 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-zinc-900/50 p-6 rounded-lg backdrop-blur-md border border-zinc-800">
          <div className="text-7xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-4">Você não tem permissão para acessar esta página</h2>
          
          <p className="text-zinc-400 mb-6">
            {userData 
              ? `Seu perfil atual (${userData.profileType}) não tem acesso a este recurso.` 
              : 'Você precisa fazer login para acessar este recurso.'}
          </p>
          
          <div className="flex flex-col space-y-3">
            <Button 
              asChild
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              <Link to="/">Voltar para a Página Inicial</Link>
            </Button>
            
            {userData && (
              <Button 
                asChild
                variant="outline" 
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <Link to="/profile">Ir para seu Perfil</Link>
              </Button>
            )}
            
            {!userData && (
              <Button 
                asChild
                variant="outline" 
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <Link to="/login">Fazer Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
