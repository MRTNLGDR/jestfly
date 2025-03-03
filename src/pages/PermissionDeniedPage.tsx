
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Shield, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const PermissionDeniedPage: React.FC = () => {
  const { profile, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center">
              <Shield className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          
          <p className="text-white/70 mb-6">
            Você não tem permissão para acessar esta página. Esta área é restrita a usuários com privilégios específicos.
          </p>
          
          {profile && (
            <div className="mb-8 p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-white/70">
                Logado como <span className="text-white font-medium">{profile.display_name}</span>
                <br />
                Tipo de perfil: <span className="text-white font-medium">{profile.profile_type}</span>
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="border-white/20">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Voltar para o início
              </Link>
            </Button>
            
            <Button 
              onClick={() => signOut()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Sair e trocar de conta
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PermissionDeniedPage;
