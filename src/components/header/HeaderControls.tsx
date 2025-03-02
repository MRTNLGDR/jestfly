
import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';
import ZoomControls from './ZoomControls';
import PreOrderButton from './PreOrderButton';

const HeaderControls: React.FC = () => {
  return (
    <div className="hidden sm:flex items-center space-x-4">
      <LanguageSwitcher />
      <CurrencySwitcher />
      <ZoomControls />
      <PreOrderButton />
    </div>
  );
};

export default HeaderControls;
