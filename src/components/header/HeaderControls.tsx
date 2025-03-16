
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';
import ZoomControls from './ZoomControls';
import PreOrderButton from './PreOrderButton';
import { useIsMobile } from '../../hooks/use-mobile';
import { useAuth } from '../../contexts/auth';
import { Button } from '../ui/button';
import { LogOut, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const HeaderControls: React.FC = () => {
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const loadingToastId = toast.loading('Saindo...');
      
      await logout();
      
      toast.dismiss(loadingToastId);
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error('Falha ao fazer logout. Tente novamente.');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      {!isMobile && (
        <>
          <LanguageSwitcher />
          <CurrencySwitcher />
          <ZoomControls />
        </>
      )}
      <PreOrderButton />
      {currentUser ? (
        <div className="flex items-center space-x-2">
          <Link 
            to="/profile" 
            className="px-3 py-1.5 rounded-md flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            <User className="h-4 w-4 mr-1" />
            <span>Perfil</span>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <Link 
          to="/login" 
          className="px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default HeaderControls;
