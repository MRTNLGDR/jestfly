
import React, { useEffect, useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { ProtectedRoute } from '../components/ProtectedRoute';

const LoginPage: React.FC = () => {
  const [flashState, setFlashState] = useState(0);
  
  // Efeito de sirene de polícia
  useEffect(() => {
    const interval = setInterval(() => {
      setFlashState(prev => (prev + 1) % 3);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  // Cores da sirene baseadas no estado
  const getFlashColor = () => {
    switch(flashState) {
      case 0: return 'bg-purple-600/20';
      case 1: return 'bg-blue-600/20';
      case 2: return 'bg-green-600/20';
      default: return 'bg-purple-600/20';
    }
  };
  
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center bg-black relative overflow-hidden">
        {/* Faixas de restrição estilo policial */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
          <div className="absolute top-0 left-0 w-full h-16 bg-yellow-400 rotate-12 translate-y-20 -translate-x-10"></div>
          <div className="absolute top-0 left-0 w-full h-16 bg-black rotate-12 translate-y-36 -translate-x-10"></div>
          <div className="absolute top-0 left-0 w-full h-16 bg-yellow-400 rotate-12 translate-y-52 -translate-x-10"></div>
          <div className="absolute top-0 left-0 w-full h-16 bg-black rotate-12 translate-y-68 -translate-x-10"></div>
          <div className="absolute top-0 left-0 w-full h-16 bg-yellow-400 rotate-12 translate-y-84 -translate-x-10"></div>
          
          <div className="absolute top-0 right-0 w-full h-16 bg-yellow-400 -rotate-12 translate-y-20 translate-x-10"></div>
          <div className="absolute top-0 right-0 w-full h-16 bg-black -rotate-12 translate-y-36 translate-x-10"></div>
          <div className="absolute top-0 right-0 w-full h-16 bg-yellow-400 -rotate-12 translate-y-52 translate-x-10"></div>
          <div className="absolute top-0 right-0 w-full h-16 bg-black -rotate-12 translate-y-68 translate-x-10"></div>
          <div className="absolute top-0 right-0 w-full h-16 bg-yellow-400 -rotate-12 translate-y-84 translate-x-10"></div>
        </div>
        
        {/* Gradiente sutil */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/90 to-black -z-15"></div>
        
        {/* Efeito de fumaça/fog */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90 z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent z-10"></div>
        
        {/* Luz piscando estilo policial */}
        <div className={`absolute top-0 left-0 w-full h-full ${getFlashColor()} blur-[150px] opacity-50 transition-colors duration-700 ease-in-out -z-10`}></div>
        
        <div className="relative z-20">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-3xl font-extrabold text-center text-white mb-6 flex flex-col items-center">
              <span className="text-xl uppercase tracking-widest mb-2 text-yellow-400">ÁREA RESTRITA</span>
              <span className="text-3xl">JESTFLY LOGIN</span>
              <div className="w-40 h-1 bg-gradient-to-r from-purple-600 to-blue-500 mt-3 rounded-full"></div>
            </h2>
          </div>
          <LoginForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LoginPage;
