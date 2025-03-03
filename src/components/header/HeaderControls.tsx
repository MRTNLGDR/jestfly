
import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';
import ZoomControls from './ZoomControls';
import PreOrderButton from './PreOrderButton';
import UserMenu from './UserMenu';
import { useIsMobile } from '../../hooks/use-mobile';
import { useAuth } from '../../contexts/auth';

const HeaderControls: React.FC = () => {
  const isMobile = useIsMobile();
  const { currentUser } = useAuth();
  
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
      {!isMobile && (
        !currentUser ? (
          <Link 
            to="/login" 
            className="px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            Login
          </Link>
        ) : (
          <UserMenu />
        )
      )}
    </div>
  );
};

export default HeaderControls;
