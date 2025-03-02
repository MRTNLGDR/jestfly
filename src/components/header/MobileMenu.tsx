
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import PreOrderButton from './PreOrderButton';
import { Settings } from 'lucide-react';

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
  
  // Agrupar itens de menu por categorias
  const mainMenuItems = menuItems.filter(item => 
    ['Início', 'Store', 'Community', 'Bookings'].includes(item.label)
  );
  
  const resourceMenuItems = menuItems.filter(item => 
    ['Resources', 'Notes', 'Demo Submission', 'Press Kit'].includes(item.label)
  );
  
  const userMenuItems = menuItems.filter(item => 
    ['Profile', 'Live Stream', 'Airdrop'].includes(item.label)
  );
  
  return (
    <div className="lg:hidden bg-black/95 backdrop-blur-md">
      <div className="px-6 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
        {/* Principal */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Principal</h3>
          {mainMenuItems.map((item) => (
            <Link 
              key={item.href} 
              to={item.href}
              className={`block text-white py-2 hover:text-purple-400 transition-colors ${
                activePathname.includes(item.href) && item.href !== '/' ? 'text-purple-400' : ''
              }`}
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        {/* Recursos */}
        <div className="mb-3 pt-2 border-t border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Recursos</h3>
          {resourceMenuItems.map((item) => (
            <Link 
              key={item.href} 
              to={item.href}
              className={`block text-white py-2 hover:text-purple-400 transition-colors ${
                activePathname.includes(item.href) && item.href !== '/' ? 'text-purple-400' : ''
              }`}
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        {/* Usuário */}
        <div className="mb-3 pt-2 border-t border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Conta</h3>
          {userMenuItems.map((item) => (
            <Link 
              key={item.href} 
              to={item.href}
              className={`block text-white py-2 hover:text-purple-400 transition-colors ${
                activePathname.includes(item.href) && item.href !== '/' ? 'text-purple-400' : ''
              }`}
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          ))}
          
          <Link 
            to="/login" 
            className="block text-white py-2 hover:text-purple-400 transition-colors"
            onClick={onItemClick}
          >
            Login
          </Link>
          
          <Link 
            to="/admin" 
            className="flex items-center text-white py-2 hover:text-purple-400 transition-colors"
            onClick={onItemClick}
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Link>
        </div>
        
        {/* Language and currency selectors for mobile */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Idioma</h3>
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
            <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Moeda</h3>
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
        <div className="sm:hidden pt-4 border-t border-zinc-800 flex justify-center space-x-8">
          <PreOrderButton />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
