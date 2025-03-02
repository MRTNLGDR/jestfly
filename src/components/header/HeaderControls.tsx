
import React from 'react';
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
    </div>
  );
};

export default HeaderControls;
