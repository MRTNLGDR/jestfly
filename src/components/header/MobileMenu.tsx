
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import PreOrderButton from './PreOrderButton';
import { Settings, Home, ShoppingBag, Users, Calendar, BookOpen, PenTool, HardDrive, User, Video, Gift, LogOut } from 'lucide-react';
import JestCoinTicker from '../JestCoinTicker';
import { useAuth } from '../../contexts/auth';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ElementType;
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
  
  const { currentUser, logout } = useAuth();
  
  if (!isOpen) return null;
  
  // Define ícones para cada item de menu
  const icons: Record<string, React.ElementType> = {
    'Início': Home,
    'Store': ShoppingBag,
    'Community': Users,
    'Bookings': Calendar,
    'Resources': BookOpen,
    'Notes': PenTool,
    'Demo Submission': HardDrive,
    'Press Kit': BookOpen,
    'Profile': User,
    'Live Stream': Video,
    'Airdrop': Gift,
  };
  
  // Agrupar itens de menu por categorias
  const mainMenuItems = menuItems.filter(item => 
    ['Início', 'Store', 'Community', 'Bookings'].includes(item.label)
  ).map(item => ({ ...item, icon: icons[item.label] }));
  
  const resourceMenuItems = menuItems.filter(item => 
    ['Resources', 'Notes', 'Demo Submission', 'Press Kit'].includes(item.label)
  ).map(item => ({ ...item, icon: icons[item.label] }));
  
  const userMenuItems = menuItems.filter(item => 
    ['Profile', 'Live Stream', 'Airdrop'].includes(item.label)
  ).map(item => ({ ...item, icon: icons[item.label] }));
  
  // Handler para logout
  const handleLogout = async () => {
    try {
      await logout();
      onItemClick(); // Fechar o menu
    } catch (error) {
      console.error("Falha ao fazer logout:", error);
    }
  };
  
  return (
    <div className="lg:hidden fixed top-[60px] md:top-[70px] left-0 right-0 max-h-[calc(100vh-60px)] overflow-y-auto bg-black/95 backdrop-blur-md z-50 border-b border-white/10 shadow-lg">
      <div className="px-4 py-4 space-y-1">
        {/* Principal */}
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Principal</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {mainMenuItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-purple-800/20 transition-colors ${
                  activePathname.includes(item.href) && item.href !== '/' ? 'bg-purple-800/30 text-purple-300' : 'text-white/80'
                }`}
                onClick={onItemClick}
              >
                {item.icon && <item.icon className="h-5 w-5 mb-1" />}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Recursos */}
        <div className="mb-3 pt-2 border-t border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Recursos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {resourceMenuItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-purple-800/20 transition-colors ${
                  activePathname.includes(item.href) && item.href !== '/' ? 'bg-purple-800/30 text-purple-300' : 'text-white/80'
                }`}
                onClick={onItemClick}
              >
                {item.icon && <item.icon className="h-5 w-5 mb-1" />}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Usuário */}
        <div className="mb-3 pt-2 border-t border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">Conta</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {userMenuItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-purple-800/20 transition-colors ${
                  activePathname.includes(item.href) && item.href !== '/' ? 'bg-purple-800/30 text-purple-300' : 'text-white/80'
                }`}
                onClick={onItemClick}
              >
                {item.icon && <item.icon className="h-5 w-5 mb-1" />}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
            
            {!currentUser && (
              <Link 
                to="/login" 
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-purple-800/20 transition-colors text-white/80"
                onClick={onItemClick}
              >
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Login</span>
              </Link>
            )}
            
            {currentUser && (
              <button 
                onClick={handleLogout}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-purple-800/20 transition-colors text-white/80"
              >
                <LogOut className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Logout</span>
              </button>
            )}
            
            <Link 
              to="/admin" 
              className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-purple-800/20 transition-colors text-white/80"
              onClick={onItemClick}
            >
              <Settings className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Admin</span>
            </Link>
          </div>
        </div>
        
        {/* JestCoin ticker for mobile */}
        <div className="pt-2 border-t border-zinc-800 mb-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2 tracking-wider">JestCoin</h3>
          <JestCoinTicker />
        </div>
        
        {/* Language and currency selectors for mobile */}
        <div className="pt-2 border-t border-zinc-800">
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
      </div>
    </div>
  );
};

export default MobileMenu;
