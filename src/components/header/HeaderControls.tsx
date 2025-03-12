
import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';
import ZoomControls from './ZoomControls';
import PreOrderButton from './PreOrderButton';
import { useIsMobile } from '../../hooks/use-mobile';
import { useAuth } from '../../contexts/auth';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';

const HeaderControls: React.FC = () => {
  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  return (
    <div className="flex items-center space-x-1">
      {!isMobile && (
        <>
          <LanguageSwitcher />
          <CurrencySwitcher />
          <ZoomControls />
        </>
      )}
      
      {/* PreOrderButton mostrado em todos os dispositivos, mas com tamanho reduzido em mobile */}
      <div className={isMobile ? "scale-90 mr-1" : ""}>
        <PreOrderButton />
      </div>

      {/* Profile/Login buttons */}
      {currentUser ? (
        <div className="flex items-center space-x-1">
          <Link 
            to="/profile" 
            className="p-1.5 rounded-md flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
            aria-label="Profile"
          >
            <User className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
          
          {/* Logout button shown only on larger screens */}
          {!isMobile && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white p-1.5 h-auto"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Link 
          to="/login" 
          className="p-1.5 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center"
          aria-label="Login"
        >
          <User className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Login</span>
        </Link>
      )}
    </div>
  );
};

export default HeaderControls;
