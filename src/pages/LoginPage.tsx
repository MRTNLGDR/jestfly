
import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/auth';

const LoginPage: React.FC = () => {
  const { userData } = useAuth();
  const isAdmin = userData?.profileType === 'admin';

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black bg-opacity-90"></div>
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: `linear-gradient(#9b59b6 1px, transparent 1px), linear-gradient(90deg, #9b59b6 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>
        
        {/* Gradient light effects - positioned away from center */}
        <div className="absolute top-0 left-0 right-0 bottom-0 -z-5">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-600/10 rounded-full blur-[120px] transform -translate-x-1/4"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-600/10 rounded-full blur-[120px] transform translate-x-1/4"></div>
          <div className="absolute top-1/2 right-0 w-1/4 h-1/4 bg-indigo-600/10 rounded-full blur-[80px] transform -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10">
          {/* Formulário com estilo diferente para admin */}
          <div className={isAdmin ? "admin-login" : ""}>
            <LoginForm />
          </div>
          
          {/* Indicador visual para login de admin */}
          {isAdmin && (
            <div className="mt-4 text-center">
              <span className="px-4 py-1 bg-gradient-to-r from-red-600 to-purple-600 text-white text-xs rounded-full">
                Acesso de Administrador
              </span>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LoginPage;
