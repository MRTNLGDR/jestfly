
import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';
import ZoomControls from './ZoomControls';
import PreOrderButton from './PreOrderButton';
import { useIsMobile } from '../../hooks/use-mobile';

const HeaderControls: React.FC = () => {
  const isMobile = useIsMobile();
  
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
        <Link 
          to="/login" 
          className="px-4 py-2 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors text-sm font-medium"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default HeaderControls;
