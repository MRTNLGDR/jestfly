
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import PreOrderButton from './PreOrderButton';
import { Settings, Home, Store, Users, Calendar, FileText, Upload, User, Video, Gift } from 'lucide-react';
import JestCoinTicker from '../JestCoinTicker';

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
  
  // Map menu items to their respective icons
  const getMenuIcon = (label: string) => {
    switch (label) {
      case 'Início': return <Home className="h-5 w-5" />;
      case 'Store': return <Store className="h-5 w-5" />;
      case 'Community': return <Users className="h-5 w-5" />;
      case 'Bookings': return <Calendar className="h-5 w-5" />;
      case 'Resources': return <FileText className="h-5 w-5" />;
      case 'Notes': return <FileText className="h-5 w-5" />;
      case 'Demo Submission': return <Upload className="h-5 w-5" />;
      case 'Press Kit': return <FileText className="h-5 w-5" />;
      case 'Profile': return <User className="h-5 w-5" />;
      case 'Live Stream': return <Video className="h-5 w-5" />;
      case 'Airdrop': return <Gift className="h-5 w-5" />;
      default: return null;
    }
  };
  
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
    <div className="lg:hidden fixed top-[60px] left-0 right-0 max-h-[calc(100vh-60px)] overflow-y-auto bg-black/95 backdrop-blur-md z-50 border-b border-white/10 shadow-lg">
      <div className="px-6 py-4 space-y-1">
        {/* Principal */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Principal</h3>
          {mainMenuItems.map((item) => (
            <Link 
              key={item.href} 
              to={item.href}
              className={`flex items-center gap-3 py-3 hover:text-purple-400 transition-colors ${
                activePathname === item.href || (item.href !== '/' && activePathname.includes(item.href)) 
                  ? 'text-purple-400' 
                  : 'text-white'
              }`}
              onClick={onItemClick}
            >
              {getMenuIcon(item.label)}
              <span>{item.label}</span>
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
              className={`flex items-center gap-3 py-3 hover:text-purple-400 transition-colors ${
                activePathname === item.href || (item.href !== '/' && activePathname.includes(item.href)) 
                  ? 'text-purple-400' 
                  : 'text-white'
              }`}
              onClick={onItemClick}
            >
              {getMenuIcon(item.label)}
              <span>{item.label}</span>
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
              className={`flex items-center gap-3 py-3 hover:text-purple-400 transition-colors ${
                activePathname === item.href || (item.href !== '/' && activePathname.includes(item.href)) 
                  ? 'text-purple-400' 
                  : 'text-white'
              }`}
              onClick={onItemClick}
            >
              {getMenuIcon(item.label)}
              <span>{item.label}</span>
            </Link>
          ))}
          
          <Link 
            to="/login" 
            className="flex items-center gap-3 py-3 text-white hover:text-purple-400 transition-colors"
            onClick={onItemClick}
          >
            <User className="h-5 w-5" />
            <span>Login</span>
          </Link>
          
          <Link 
            to="/admin" 
            className="flex items-center gap-3 py-3 text-white hover:text-purple-400 transition-colors"
            onClick={onItemClick}
          >
            <Settings className="h-5 w-5" />
            <span>Admin</span>
          </Link>
        </div>
        
        {/* JestCoin ticker for mobile */}
        <div className="pt-2 border-t border-zinc-800 mb-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">JestCoin</h3>
          <div className="bg-black/30 p-3 rounded-lg backdrop-blur-sm">
            <JestCoinTicker />
          </div>
        </div>
        
        {/* Language and currency selectors for mobile */}
        <div className="pt-2 border-t border-zinc-800">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Idioma</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
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
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
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
      </div>
    </div>
  );
};

export default MobileMenu;
