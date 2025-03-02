
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import PreOrderButton from './PreOrderButton';

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  onItemClick: () => void;
  activePathname: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, menuItems, onItemClick, activePathname }) => {
  const { 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    availableLanguages, 
    availableCurrencies 
  } = useLanguage();
  
  if (!isOpen) return null;
  
  return (
    <div className="lg:hidden bg-black/90 backdrop-blur-md">
      <div className="px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`block text-white py-2 hover:text-purple-400 transition-colors uppercase ${
              activePathname.includes(item.href) && item.href !== '/' ? 'text-purple-400' : ''
            }`}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        ))}
        
        {/* Language and currency selectors for mobile */}
        <div className="pt-4 border-t border-white/10">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-white/70">Language</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    lang === language 
                      ? 'bg-purple-700 text-white' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  onClick={() => setLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-white/70">Currency</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableCurrencies.map((curr) => (
                <button
                  key={curr}
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    curr === currency 
                      ? 'bg-purple-700 text-white' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  onClick={() => setCurrency(curr)}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile-only controls */}
        <div className="sm:hidden pt-4 border-t border-white/10 flex justify-center space-x-8">
          <PreOrderButton />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
